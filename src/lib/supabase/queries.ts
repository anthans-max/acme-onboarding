import "server-only";
import { EMPLOYEE_ID } from "@/lib/config";
import { createSupabaseServerClient } from "./server";
import type {
  BuildingAccessItem,
  Employee,
  EquipmentItem,
  HrDocument,
  OnboardingSession,
  SystemAccess,
} from "./types";

export type EmployeeWithSession = { employee: Employee; session: OnboardingSession };

export async function getOrSeedEmployee(): Promise<EmployeeWithSession> {
  const supabase = createSupabaseServerClient();

  const existing = await supabase.from("onboarding_employees").select("*").eq("id", EMPLOYEE_ID).maybeSingle();
  if (existing.error) throw existing.error;

  if (!existing.data) {
    const email = `alex.johnson+${EMPLOYEE_ID.slice(0, 8)}@acme.com`;
    const authCreate = await supabase.auth.admin.createUser({
      id: EMPLOYEE_ID,
      email,
      email_confirm: true,
      password: crypto.randomUUID() + crypto.randomUUID(),
    });
    if (authCreate.error && !/already (registered|exists)/i.test(authCreate.error.message)) {
      throw authCreate.error;
    }
    const insert = await supabase
      .from("onboarding_employees")
      .insert({
        id: EMPLOYEE_ID,
        email,
        first_name: "Alex",
        last_name: "Johnson",
        department: "Engineering",
        job_title: "Software Engineer",
        location: "Los Angeles (HQ)",
        start_date: "2025-01-15",
      })
      .select("*")
      .single();
    if (insert.error) throw insert.error;
  }

  const session = await ensureSession();
  const employee = await supabase.from("onboarding_employees").select("*").eq("id", EMPLOYEE_ID).single();
  if (employee.error) throw employee.error;
  return { employee: employee.data as Employee, session };
}

async function ensureSession(): Promise<OnboardingSession> {
  const supabase = createSupabaseServerClient();
  const existing = await supabase
    .from("onboarding_sessions")
    .select("*")
    .eq("employee_id", EMPLOYEE_ID)
    .maybeSingle();
  if (existing.error) throw existing.error;
  if (existing.data) return existing.data as OnboardingSession;

  const rpc = await supabase.rpc("onboarding_seed_employee", { p_employee_id: EMPLOYEE_ID });
  if (rpc.error) throw rpc.error;

  const after = await supabase
    .from("onboarding_sessions")
    .select("*")
    .eq("employee_id", EMPLOYEE_ID)
    .single();
  if (after.error) throw after.error;
  return after.data as OnboardingSession;
}

export async function getSession(): Promise<OnboardingSession> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("onboarding_sessions")
    .select("*")
    .eq("employee_id", EMPLOYEE_ID)
    .single();
  if (error) throw error;
  return data as OnboardingSession;
}

export async function getSystems(): Promise<SystemAccess[]> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("onboarding_system_access")
    .select("*")
    .eq("employee_id", EMPLOYEE_ID)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as SystemAccess[];
}

export async function getDocuments(): Promise<HrDocument[]> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("onboarding_hr_documents")
    .select("*")
    .eq("employee_id", EMPLOYEE_ID)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as HrDocument[];
}

export async function getEquipment(): Promise<EquipmentItem[]> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("onboarding_equipment")
    .select("*")
    .eq("employee_id", EMPLOYEE_ID)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as EquipmentItem[];
}

export async function getBuildingAccess(): Promise<BuildingAccessItem[]> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("onboarding_building_access")
    .select("*")
    .eq("employee_id", EMPLOYEE_ID)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as BuildingAccessItem[];
}

export type EmployeeWithProgress = Employee & {
  session: OnboardingSession | null;
  progressPct: number;
  statusLabel: "In progress" | "Complete" | "Not started" | "Overdue forms";
};

export async function getAllEmployeesWithProgress(): Promise<EmployeeWithProgress[]> {
  const supabase = createSupabaseServerClient();
  const [emps, sessions, docs] = await Promise.all([
    supabase.from("onboarding_employees").select("*").order("created_at", { ascending: false }),
    supabase.from("onboarding_sessions").select("*"),
    supabase.from("onboarding_hr_documents").select("id,employee_id,status,is_required"),
  ]);
  if (emps.error) throw emps.error;
  if (sessions.error) throw sessions.error;
  if (docs.error) throw docs.error;

  const sessionByEmp = new Map<string, OnboardingSession>();
  for (const s of sessions.data ?? []) sessionByEmp.set((s as OnboardingSession).employee_id, s as OnboardingSession);

  const overdueByEmp = new Map<string, boolean>();
  const now = Date.now();
  const empStarts = new Map<string, number | null>();
  for (const r of emps.data ?? []) {
    const e = r as Employee;
    empStarts.set(e.id, e.start_date ? new Date(e.start_date).getTime() : null);
  }
  for (const d of docs.data ?? []) {
    const doc = d as HrDocument;
    if (!doc.is_required || isDocDone(doc.status)) continue;
    const start = empStarts.get(doc.employee_id) ?? null;
    if (start !== null && start < now) overdueByEmp.set(doc.employee_id, true);
  }

  return (emps.data ?? []).map((row) => {
    const emp = row as Employee;
    const session = sessionByEmp.get(emp.id) ?? null;
    const pct = session ? computeProgress(session) : 0;
    let status: EmployeeWithProgress["statusLabel"];
    if (session?.is_complete) status = "Complete";
    else if (overdueByEmp.get(emp.id)) status = "Overdue forms";
    else if (pct === 0) status = "Not started";
    else status = "In progress";
    return { ...emp, session, progressPct: pct, statusLabel: status };
  });
}

export function isDocDone(status: HrDocument["status"]): boolean {
  return status === "completed" || status === "signed";
}

export function isDocOverdue(doc: HrDocument, employeeStart: string | null): boolean {
  if (!doc.is_required || isDocDone(doc.status)) return false;
  if (!employeeStart) return false;
  return new Date(employeeStart).getTime() < Date.now();
}

export type EmployeeDetail = EmployeeWithProgress & {
  systems: SystemAccess[];
  documents: HrDocument[];
  equipment: EquipmentItem[];
  buildingAccess: BuildingAccessItem[];
};

export async function getEmployeeDetail(employeeId: string): Promise<EmployeeDetail | null> {
  const supabase = createSupabaseServerClient();
  const [emp, session, sys, docs, equip, access] = await Promise.all([
    supabase.from("onboarding_employees").select("*").eq("id", employeeId).maybeSingle(),
    supabase.from("onboarding_sessions").select("*").eq("employee_id", employeeId).maybeSingle(),
    supabase.from("onboarding_system_access").select("*").eq("employee_id", employeeId).order("sort_order"),
    supabase.from("onboarding_hr_documents").select("*").eq("employee_id", employeeId).order("sort_order"),
    supabase.from("onboarding_equipment").select("*").eq("employee_id", employeeId).order("sort_order"),
    supabase.from("onboarding_building_access").select("*").eq("employee_id", employeeId).order("sort_order"),
  ]);
  if (emp.error) throw emp.error;
  if (!emp.data) return null;
  const employee = emp.data as Employee;
  const s = (session.data as OnboardingSession | null) ?? null;
  const pct = s ? computeProgress(s) : 0;
  const overdueHas = (docs.data ?? []).some((d) => isDocOverdue(d as HrDocument, employee.start_date));
  let status: EmployeeDetail["statusLabel"];
  if (s?.is_complete) status = "Complete";
  else if (overdueHas) status = "Overdue forms";
  else if (pct === 0) status = "Not started";
  else status = "In progress";

  return {
    ...employee,
    session: s,
    progressPct: pct,
    statusLabel: status,
    systems: (sys.data ?? []) as SystemAccess[],
    documents: (docs.data ?? []) as HrDocument[],
    equipment: (equip.data ?? []) as EquipmentItem[],
    buildingAccess: (access.data ?? []) as BuildingAccessItem[],
  };
}

function computeProgress(session: OnboardingSession): number {
  if (session.is_complete) return 100;
  const completed = session.completed_steps?.length ?? 0;
  return Math.round((completed / 6) * 100);
}
