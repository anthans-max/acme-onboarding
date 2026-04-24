import { TaskItem, type TaskStatus } from "@/components/shared/task-item";
import type { BuildingAccessItem, Employee, EquipmentItem, HrDocument, SystemAccess } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";
import { formatShortDate } from "@/lib/format";

type Props = {
  employee: Employee;
  systems: SystemAccess[];
  documents: HrDocument[];
  equipment: EquipmentItem[];
  access: BuildingAccessItem[];
};

export function CompletionHero({ employee, systems, documents, equipment, access }: Props) {
  const first = employee.preferred_name?.trim() || employee.first_name?.trim() || "there";
  const systemsSelected = systems.filter((s) => s.is_required || s.is_requested).length;
  const docsDone = documents.filter((d) => d.status === "completed" || d.status === "signed").length;
  const equipmentReceived = equipment.filter((e) => e.is_received).length;
  const accessPendingCount = access.filter((a) => a.status !== "active").length;

  const stats: { label: string; value: string; tone?: "success" | "default" }[] = [
    { label: "Profile", value: "✓", tone: "success" },
    { label: "Systems", value: `${systemsSelected} / ${systems.length}` },
    { label: "HR forms", value: `${docsDone} / ${documents.length}` },
    { label: "Equipment", value: `${equipmentReceived} / ${equipment.length}` },
  ];

  const tasks = buildTasks({ documents, access, accessPendingCount, startDate: employee.start_date });

  return (
    <div className="flex flex-col gap-6">
      <div
        className="rounded-2xl text-white p-10 text-center"
        style={{ background: "linear-gradient(135deg, var(--success-600) 0%, var(--success-800) 100%)" }}
      >
        <div className="text-5xl mb-4">🎉</div>
        <h1 className="text-[28px] font-semibold mb-2">You&rsquo;re all set, {first}!</h1>
        <p className="text-[15px] opacity-80 leading-relaxed">
          Onboarding complete. Your HR admin has been notified and IT is processing your requests.
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-md border border-gray-100 bg-white p-4 shadow-card">
            <div className="text-[12px] text-gray-400 mb-1">{s.label}</div>
            <div className={cn("text-[22px] font-semibold leading-none", s.tone === "success" ? "text-success-600" : "text-gray-800")}>
              {s.value}
            </div>
            <div className="text-[11px] text-gray-400 mt-1">
              {s.label === "Profile" ? "Complete" : s.label === "Systems" ? "Requested" : s.label === "HR forms" ? "Completed" : "Confirmed"}
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-card">
        <div className="text-[13px] font-semibold uppercase tracking-[0.06em] text-gray-500 mb-2">What happens next</div>
        <div className="flex flex-col">
          {tasks.map((t, i) => (
            <TaskItem key={t.text} status={t.status} text={t.text} date={t.date} last={i === tasks.length - 1} />
          ))}
        </div>
      </div>
    </div>
  );
}

function buildTasks({
  documents,
  access,
  accessPendingCount,
  startDate,
}: {
  documents: HrDocument[];
  access: BuildingAccessItem[];
  accessPendingCount: number;
  startDate: string | null;
}): { status: TaskStatus; text: string; date?: string }[] {
  const tasks: { status: TaskStatus; text: string; date?: string }[] = [];
  const docsPending = documents.filter((d) => d.is_required && d.status !== "completed" && d.status !== "signed").length;
  if (docsPending > 0) {
    tasks.push({ status: "pending", text: `Complete ${docsPending} remaining HR form${docsPending === 1 ? "" : "s"}`, date: "Pending" });
  } else {
    tasks.push({ status: "done", text: "All required HR forms complete", date: "Done" });
  }
  const badge = access.find((a) => a.access_key?.toLowerCase().includes("badge"));
  if (badge) {
    tasks.push({
      status: badge.status === "active" ? "done" : "pending",
      text: "Pick up badge & key card from reception on your first day",
      date: startDate ? formatShortDate(startDate) : "TBD",
    });
  }
  if (accessPendingCount > 0) {
    tasks.push({
      status: "pending",
      text: `IT will provision ${accessPendingCount} remaining access item${accessPendingCount === 1 ? "" : "s"}`,
      date: "In progress",
    });
  }
  tasks.push({ status: "done", text: "Welcome email from your manager — check your inbox", date: "Done" });
  return tasks;
}
