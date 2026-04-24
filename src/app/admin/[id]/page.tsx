import { notFound } from "next/navigation";
import { DetailHeader } from "@/components/admin/detail-header";
import { DetailProfile } from "@/components/admin/detail-profile";
import { DetailSection, type SectionItem } from "@/components/admin/detail-section";
import { AdminNotes } from "@/components/admin/admin-notes";
import { ActivityFeed, type ActivityEvent } from "@/components/admin/activity-feed";
import { STEPS } from "@/lib/config";
import { getEmployeeDetail, isDocDone, isDocOverdue } from "@/lib/supabase/queries";
import { formatShortDate, formatDate } from "@/lib/format";
import type { TaskStatus } from "@/components/shared/task-item";

export default async function EmployeeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const employee = await getEmployeeDetail(id);
  if (!employee) notFound();

  const docItems: SectionItem[] = employee.documents.map((d) => {
    const done = isDocDone(d.status);
    const overdue = isDocOverdue(d, employee.start_date);
    const status: TaskStatus = done ? "done" : overdue ? "overdue" : "pending";
    const date = done
      ? d.status === "signed"
        ? `Signed ${formatShortDate(d.completed_at)}`
        : `Completed ${formatShortDate(d.completed_at)}`
      : overdue
        ? "Overdue"
        : "Pending";
    return { id: d.id, status, text: d.document_name, date, dateTone: overdue ? "overdue" : "default" };
  });

  const systemItems: SectionItem[] = employee.systems
    .filter((s) => s.is_required || s.is_requested)
    .map((s) => {
      const done = !!s.provisioned_at;
      return {
        id: s.id,
        status: done ? "done" : "pending",
        text: `${s.system_name} · ${done ? "Provisioned" : "Pending"}`,
        date: done ? formatShortDate(s.provisioned_at) : "Requested",
      };
    });

  const progressItems: SectionItem[] = STEPS.map((step) => {
    const isComplete = employee.session?.is_complete || (employee.session?.completed_steps ?? []).includes(step.order);
    const isCurrent = !isComplete && (employee.session?.current_step ?? 0) === step.order;
    const status: TaskStatus = isComplete ? "done" : isCurrent ? "pending" : "pending";
    return {
      id: step.slug,
      status,
      text: step.name + (isCurrent ? " — in progress" : isComplete ? "" : " — not started"),
    };
  });

  const activity = buildActivity(employee);

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-6 lg:py-8">
      <DetailHeader employee={employee} />
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5 items-start">
        <div className="flex flex-col gap-5">
          <DetailProfile employee={employee} />
          <DetailSection title="HR documents" items={docItems} />
          <DetailSection title="System access requests" items={systemItems} />
        </div>
        <div className="flex flex-col gap-5">
          <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-card">
            <div className="text-[12px] font-semibold uppercase tracking-[0.06em] text-gray-400 mb-2">Onboarding progress</div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[13px] text-gray-600">Overall completion</span>
              <span className="text-[13px] font-semibold text-brand-600">{employee.progressPct}%</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-pill overflow-hidden mb-3">
              <div
                className={`h-full rounded-pill ${employee.session?.is_complete ? "bg-success-400" : "bg-brand-400"}`}
                style={{ width: `${employee.progressPct}%` }}
              />
            </div>
            <DetailSection title="" items={progressItems} />
          </div>
          <ActivityFeed events={activity} />
          <AdminNotes employeeId={employee.id} />
        </div>
      </div>
      <p className="sr-only">Started on {formatDate(employee.start_date)}</p>
    </div>
  );
}

function buildActivity(employee: NonNullable<Awaited<ReturnType<typeof getEmployeeDetail>>>): ActivityEvent[] {
  const events: ActivityEvent[] = [];

  for (const doc of employee.documents) {
    if (doc.completed_at) {
      events.push({
        id: `doc-${doc.id}`,
        icon: "📄",
        text: `Completed ${doc.document_name.toLowerCase()}`,
        timestamp: doc.completed_at,
      });
    }
  }
  for (const sys of employee.systems) {
    if (sys.provisioned_at) {
      events.push({
        id: `sys-${sys.id}`,
        icon: "✅",
        text: `Provisioned ${sys.system_name}`,
        timestamp: sys.provisioned_at,
      });
    } else if (sys.is_requested) {
      events.push({
        id: `sys-req-${sys.id}`,
        icon: "🔔",
        text: `Requested access to ${sys.system_name}`,
        timestamp: sys.updated_at,
      });
    }
  }
  for (const item of employee.equipment) {
    if (item.received_at) {
      events.push({
        id: `equip-${item.id}`,
        icon: "📦",
        text: `Received ${item.item_name.toLowerCase()}`,
        timestamp: item.received_at,
      });
    }
  }
  if (employee.session?.started_at) {
    events.push({
      id: "session-start",
      icon: "👋",
      text: "Started onboarding flow",
      timestamp: employee.session.started_at,
    });
  }

  events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  return events.slice(0, 5);
}
