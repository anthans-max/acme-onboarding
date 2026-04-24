import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { StatusBadge, type StatusVariant } from "@/components/shared/status-badge";
import type { EmployeeWithProgress } from "@/lib/supabase/queries";
import { formatDate, fullName, initials } from "@/lib/format";
import { cn } from "@/lib/utils";

const AVATAR_COLORS = [
  "bg-brand-100 text-brand-600",
  "bg-success-50 text-success-600",
  "bg-warning-50 text-warning-600",
  "bg-danger-50 text-danger-600",
];

export function EmployeeTable({ rows }: { rows: EmployeeWithProgress[] }) {
  if (rows.length === 0) {
    return (
      <div className="rounded-lg border border-gray-100 bg-white p-10 text-center text-[13px] text-gray-400">
        No employees match the current filters.
      </div>
    );
  }
  return (
    <div className="rounded-lg border border-gray-100 bg-white overflow-x-auto shadow-card">
      <table className="w-full border-collapse min-w-[720px]">
        <thead>
          <tr>
            <th className="text-left px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-gray-400 bg-gray-50 border-b border-gray-100">Employee</th>
            <th className="text-left px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-gray-400 bg-gray-50 border-b border-gray-100">Department</th>
            <th className="text-left px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-gray-400 bg-gray-50 border-b border-gray-100">Start date</th>
            <th className="text-left px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-gray-400 bg-gray-50 border-b border-gray-100">Progress</th>
            <th className="text-left px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-gray-400 bg-gray-50 border-b border-gray-100">Status</th>
            <th className="text-left px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-gray-400 bg-gray-50 border-b border-gray-100" />
          </tr>
        </thead>
        <tbody>
          {rows.map((emp, i) => (
            <Row key={emp.id} emp={emp} colorIndex={i} isLast={i === rows.length - 1} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Row({ emp, colorIndex, isLast }: { emp: EmployeeWithProgress; colorIndex: number; isLast: boolean }) {
  const colorClass = AVATAR_COLORS[colorIndex % AVATAR_COLORS.length];
  const cellCls = cn("px-4 py-3.5 align-middle text-[13px] text-gray-600", !isLast && "border-b border-gray-100");
  const { variant, label } = statusToBadge(emp);
  return (
    <tr className="hover:bg-gray-50">
      <td className={cellCls}>
        <div className="flex items-center gap-3">
          <span className={cn("h-9 w-9 rounded-full grid place-items-center text-[13px] font-semibold shrink-0", colorClass)}>
            {initials(emp.first_name, emp.last_name)}
          </span>
          <span>
            <span className="block text-[14px] font-medium text-gray-700">{fullName(emp)}</span>
            <span className="block text-[12px] text-gray-400">{emp.email}</span>
          </span>
        </div>
      </td>
      <td className={cellCls}>{emp.department ?? "—"}</td>
      <td className={cn(cellCls, "text-gray-500")}>{formatDate(emp.start_date)}</td>
      <td className={cellCls}>
        <div className="flex items-center gap-2 min-w-[140px]">
          <div className="flex-1 h-1 bg-gray-100 rounded-pill overflow-hidden min-w-[60px]">
            <div className={cn("h-full rounded-pill", emp.session?.is_complete ? "bg-success-400" : "bg-brand-400")} style={{ width: `${emp.progressPct}%` }} />
          </div>
          <span className="text-[12px] text-gray-500 min-w-[28px] tabular-nums">{emp.progressPct}%</span>
        </div>
      </td>
      <td className={cellCls}>
        <StatusBadge variant={variant}>{label}</StatusBadge>
      </td>
      <td className={cellCls}>
        <Link
          href={`/admin/${emp.id}`}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-sm border border-gray-200 text-[12px] font-medium text-gray-600 hover:bg-gray-50"
        >
          View
          <ArrowRight className="h-3 w-3" />
        </Link>
      </td>
    </tr>
  );
}

function statusToBadge(emp: EmployeeWithProgress): { variant: StatusVariant; label: string } {
  switch (emp.statusLabel) {
    case "Complete":
      return { variant: "active", label: "Complete" };
    case "Not started":
      return { variant: "pending", label: "Not started" };
    case "Overdue forms":
      return { variant: "overdue", label: "Overdue forms" };
    default:
      return { variant: "scheduled", label: "In progress" };
  }
}
