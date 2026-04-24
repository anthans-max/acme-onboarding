import { StatusBadge, type StatusVariant } from "@/components/shared/status-badge";
import type { BuildingAccessItem } from "@/lib/supabase/types";
import { formatShortDate } from "@/lib/format";

export function AccessList({ items }: { items: BuildingAccessItem[] }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-card">
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <Row key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

function Row({ item }: { item: BuildingAccessItem }) {
  const { variant, label } = statusToBadge(item);
  return (
    <div className="flex items-center gap-3.5 rounded-md border border-gray-100 bg-white p-3.5">
      <span className="w-9 text-center text-[18px] shrink-0">{item.access_icon ?? "🏢"}</span>
      <div className="flex-1 min-w-0">
        <div className="text-[14px] font-medium text-gray-700">{item.access_name}</div>
        {item.access_detail ? <div className="text-[12px] text-gray-400 mt-0.5">{item.access_detail}</div> : null}
        {item.assigned_value ? (
          <div className="text-[12px] font-medium text-gray-600 mt-0.5">{item.assigned_value}</div>
        ) : null}
      </div>
      <StatusBadge variant={variant}>{label}</StatusBadge>
    </div>
  );
}

function statusToBadge(item: BuildingAccessItem): { variant: StatusVariant; label: string } {
  if (item.status === "active") return { variant: "active", label: "Active" };
  if (item.status === "scheduled") {
    const label = item.available_date ? formatShortDate(item.available_date) : "Scheduled";
    return { variant: "scheduled", label };
  }
  return { variant: "pending", label: "Pending" };
}
