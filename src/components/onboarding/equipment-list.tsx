"use client";

import { useOptimistic, useTransition } from "react";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { toggleEquipmentAction } from "@/app/onboarding/equipment/actions";
import type { EquipmentItem } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

export function EquipmentList({ items }: { items: EquipmentItem[] }) {
  const [optimistic, setOptimistic] = useOptimistic<EquipmentItem[], { id: string; is_received: boolean }>(
    items,
    (state, patch) => state.map((it) => (it.id === patch.id ? { ...it, is_received: patch.is_received } : it)),
  );
  const [, startTransition] = useTransition();

  function toggle(item: EquipmentItem) {
    const next = !item.is_received;
    startTransition(async () => {
      setOptimistic({ id: item.id, is_received: next });
      const result = await toggleEquipmentAction(item.id, next);
      if (!result.ok) toast.error(result.error || "Couldn't update");
    });
  }

  return (
    <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-card">
      <div className="flex flex-col gap-2">
        {optimistic.map((item) => (
          <Row key={item.id} item={item} onToggle={toggle} />
        ))}
      </div>
    </div>
  );
}

function Row({ item, onToggle }: { item: EquipmentItem; onToggle: (item: EquipmentItem) => void }) {
  const checked = item.is_received;
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={`${checked ? "Mark unreceived" : "Mark received"}: ${item.item_name}`}
      onClick={() => onToggle(item)}
      className={cn(
        "flex items-center gap-3.5 rounded-md border p-3.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-1",
        checked ? "border-success-400 bg-success-50" : "border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50",
      )}
    >
      <span className="w-9 text-center text-[20px] shrink-0">{item.item_icon ?? "📦"}</span>
      <span className="flex-1 min-w-0">
        <span className={cn("block text-[14px] font-medium", checked ? "text-success-800" : "text-gray-700")}>{item.item_name}</span>
        {item.item_detail ? <span className="block text-[12px] text-gray-400 mt-0.5">{item.item_detail}</span> : null}
        {item.serial_number ? (
          <span className="block font-mono text-[11px] text-gray-400 mt-0.5">SN: {item.serial_number}</span>
        ) : null}
      </span>
      <span
        className={cn(
          "h-5 w-5 rounded grid place-items-center shrink-0 border transition-colors",
          checked ? "bg-success-400 border-success-400 text-white" : "border-gray-200",
        )}
      >
        {checked ? <Check className="h-2.5 w-2.5 stroke-[3]" /> : null}
      </span>
    </button>
  );
}
