"use client";

import Link from "next/link";
import { useTransition } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { markCompleteAction, sendReminderAction } from "@/app/admin/[id]/actions";
import type { EmployeeDetail } from "@/lib/supabase/queries";
import { formatDate, fullName } from "@/lib/format";
import { cn } from "@/lib/utils";

export function DetailHeader({ employee }: { employee: EmployeeDetail }) {
  const [reminderPending, startReminder] = useTransition();
  const [completePending, startComplete] = useTransition();

  return (
    <div className="flex items-center justify-between mb-7">
      <div className="flex items-center gap-3">
        <Link href="/admin" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-gray-600 hover:text-gray-800">
          <ArrowLeft className="h-3.5 w-3.5" />
          All employees
        </Link>
        <span className="h-5 w-px bg-gray-200" />
        <div>
          <h1 className="text-[22px] font-semibold text-gray-800">{fullName(employee)}</h1>
          <p className="text-[14px] text-gray-400 mt-0.5">
            {employee.department ?? "—"} · Started {formatDate(employee.start_date) || "—"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={reminderPending}
          onClick={() =>
            startReminder(async () => {
              const r = await sendReminderAction(employee.id);
              if (r.ok) toast.success("Reminder sent");
              else toast.error(r.error || "Couldn't send");
            })
          }
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-sm text-[13px] font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 disabled:opacity-70"
        >
          {reminderPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
          Send reminder
        </button>
        <button
          type="button"
          disabled={completePending || employee.session?.is_complete}
          onClick={() =>
            startComplete(async () => {
              const r = await markCompleteAction(employee.id);
              if (r.ok) toast.success("Marked complete");
              else toast.error(r.error || "Couldn't update");
            })
          }
          className={cn(
            "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-sm text-[13px] font-medium text-white transition-colors",
            employee.session?.is_complete ? "bg-gray-300 cursor-default" : "bg-brand-600 hover:bg-brand-800",
          )}
        >
          {completePending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
          {employee.session?.is_complete ? "Completed" : "Mark complete"}
        </button>
      </div>
    </div>
  );
}
