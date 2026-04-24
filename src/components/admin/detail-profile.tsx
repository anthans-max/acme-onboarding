import type { EmployeeDetail } from "@/lib/supabase/queries";
import { formatDate, fullName, initials } from "@/lib/format";

export function DetailProfile({ employee }: { employee: EmployeeDetail }) {
  const meta: { label: string; value: React.ReactNode }[] = [
    { label: "Email", value: employee.email },
    { label: "Department", value: employee.department ?? "—" },
    { label: "Start date", value: formatDate(employee.start_date) || "—" },
    { label: "Location", value: employee.location ?? "—" },
    { label: "Phone", value: employee.mobile_phone ?? "—" },
    {
      label: "Progress",
      value: (
        <span className="text-brand-600 font-semibold">
          {employee.progressPct}% {employee.session?.is_complete ? "complete" : ""}
        </span>
      ),
    },
  ];
  return (
    <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-card">
      <div className="flex items-center gap-4 mb-5">
        <span className="h-14 w-14 rounded-full bg-brand-100 text-brand-600 grid place-items-center text-[18px] font-semibold">
          {initials(employee.first_name, employee.last_name)}
        </span>
        <div>
          <div className="text-[18px] font-semibold text-gray-800">{fullName(employee)}</div>
          <div className="text-[13px] text-gray-500">{[employee.job_title, employee.department].filter(Boolean).join(" · ") || "—"}</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {meta.map((m) => (
          <div key={m.label} className="flex flex-col">
            <span className="text-[11px] text-gray-400 mb-0.5">{m.label}</span>
            <span className="text-[13px] font-medium text-gray-700">{m.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
