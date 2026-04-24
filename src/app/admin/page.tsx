import { AdminStatsRow } from "@/components/admin/stats-row";
import { EmployeeFilters } from "@/components/admin/employee-filters";
import { EmployeeTable } from "@/components/admin/employee-table";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getAllEmployeesWithProgress } from "@/lib/supabase/queries";
import { fullName } from "@/lib/format";

export const dynamic = "force-dynamic";

type SearchParams = { filter?: string; q?: string };

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const [employees, counts] = await Promise.all([getAllEmployeesWithProgress(), getDashboardCounts()]);

  const filter = sp.filter ?? "all";
  const query = (sp.q ?? "").trim().toLowerCase();
  // Server component — Date.now is safe here (runs once per request).
  // eslint-disable-next-line react-hooks/purity
  const nowMs = Date.now();
  const filtered = employees.filter((e) => {
    if (filter === "in_progress" && e.statusLabel !== "In progress") return false;
    if (filter === "completed" && e.statusLabel !== "Complete") return false;
    if (filter === "attention" && e.statusLabel !== "Overdue forms") return false;
    if (filter === "this_week") {
      if (!e.start_date) return false;
      const start = new Date(e.start_date).getTime();
      const diff = (start - nowMs) / (1000 * 60 * 60 * 24);
      if (diff < -2 || diff > 7) return false;
    }
    if (query) {
      const hay = `${fullName(e)} ${e.email ?? ""} ${e.department ?? ""}`.toLowerCase();
      if (!hay.includes(query)) return false;
    }
    return true;
  });

  const active = employees.filter((e) => !e.session?.is_complete && e.statusLabel !== "Not started").length;
  const completed = employees.filter((e) => e.session?.is_complete).length;
  const completionRate = employees.length ? Math.round((completed / employees.length) * 100) : 0;

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-6 lg:py-8">
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-[22px] font-semibold text-gray-800">Onboarding dashboard</h1>
          <p className="text-[14px] text-gray-400 mt-0.5">
            {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })} · {employees.length} employee{employees.length === 1 ? "" : "s"}
          </p>
        </div>
        <button
          type="button"
          className="px-4 py-2 rounded-sm bg-brand-600 hover:bg-brand-800 text-white text-[13px] font-medium"
        >
          + Invite employee
        </button>
      </div>
      <AdminStatsRow
        stats={[
          { label: "Active onboardings", value: active, sub: `${employees.length - completed} in progress` },
          { label: "Completed", value: completed, sub: `${completionRate}% completion rate`, tone: "success" },
          { label: "Pending HR forms", value: counts.pendingDocs, sub: `Across ${counts.employeesWithPendingDocs} employees`, tone: "warning" },
          { label: "IT access requests", value: counts.accessRequests, sub: `${counts.pendingAccessRequests} awaiting provisioning`, tone: "brand" },
        ]}
      />
      <div className="mt-7 mb-5">
        <EmployeeFilters />
      </div>
      <EmployeeTable rows={filtered} />
    </div>
  );
}

async function getDashboardCounts() {
  const supabase = createSupabaseServerClient();
  const [docs, sys] = await Promise.all([
    supabase.from("onboarding_hr_documents").select("employee_id,status,is_required"),
    supabase.from("onboarding_system_access").select("employee_id,is_requested,is_required,provisioned_at"),
  ]);
  const pendingDocs = (docs.data ?? []).filter((d) => d.is_required && d.status === "pending").length;
  const employeesWithPendingDocs = new Set(
    (docs.data ?? []).filter((d) => d.is_required && d.status === "pending").map((d) => d.employee_id),
  ).size;
  const accessRequests = (sys.data ?? []).filter((s) => s.is_required || s.is_requested).length;
  const pendingAccessRequests = (sys.data ?? []).filter((s) => (s.is_required || s.is_requested) && !s.provisioned_at).length;
  return { pendingDocs, employeesWithPendingDocs, accessRequests, pendingAccessRequests };
}
