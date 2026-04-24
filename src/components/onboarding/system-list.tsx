"use client";

import { useOptimistic, useTransition } from "react";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { toggleSystemAction } from "@/app/onboarding/systems/actions";
import { StatusBadge } from "@/components/shared/status-badge";
import type { SystemAccess } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

const ICON_BG: Record<string, string> = {
  slack: "#E7F3FF",
  google_workspace: "#FFF0E7",
  github: "#F0F0FF",
  "1password": "#FFF8E7",
  notion: "#F0FFF4",
  jira: "#EEF4FF",
  aws: "#FFF3E7",
  expensify: "#F0FFF4",
};

export function SystemList({ items }: { items: SystemAccess[] }) {
  const [optimisticItems, setOptimistic] = useOptimistic<SystemAccess[], { id: string; is_requested: boolean }>(
    items,
    (state, patch) => state.map((it) => (it.id === patch.id ? { ...it, is_requested: patch.is_requested } : it)),
  );
  const [, startTransition] = useTransition();

  const required = optimisticItems.filter((i) => i.is_required);
  const optional = optimisticItems.filter((i) => !i.is_required);
  const selectedCount = optimisticItems.filter((i) => i.is_required || i.is_requested).length;

  function toggle(item: SystemAccess) {
    const next = !item.is_requested;
    startTransition(async () => {
      setOptimistic({ id: item.id, is_requested: next });
      const result = await toggleSystemAction(item.id, next);
      if (!result.ok) toast.error(result.error || "Couldn't update");
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <Card title="Required tools">
        {required.map((item) => (
          <Row key={item.id} item={item} onToggle={toggle} disabled={item.is_required} />
        ))}
      </Card>
      <Card title="Optional tools">
        {optional.map((item) => (
          <Row key={item.id} item={item} onToggle={toggle} />
        ))}
      </Card>
      <div className="text-[12px] text-gray-400 text-center">
        {selectedCount} of {optimisticItems.length} selected
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-card">
      <div className="text-[13px] font-semibold uppercase tracking-[0.06em] text-gray-500 mb-4">{title}</div>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

function Row({ item, onToggle, disabled }: { item: SystemAccess; onToggle: (item: SystemAccess) => void; disabled?: boolean }) {
  const checked = item.is_required || item.is_requested;
  const bg = ICON_BG[item.system_key] ?? "var(--gray-100)";
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={`${checked ? "Deselect" : "Select"} ${item.system_name}`}
      disabled={disabled}
      onClick={() => onToggle(item)}
      className={cn(
        "flex items-center gap-3.5 rounded-md border p-3.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-1",
        checked ? "border-brand-200 bg-brand-50" : "border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50",
        disabled && "cursor-default",
      )}
    >
      <span className="h-10 w-10 rounded-md grid place-items-center text-[18px] shrink-0" style={{ background: bg }}>
        {item.system_icon ?? "🔧"}
      </span>
      <span className="flex-1 min-w-0">
        <span className="block text-[14px] font-medium text-gray-700">{item.system_name}</span>
        {item.description ? <span className="block text-[12px] text-gray-400 mt-0.5">{item.description}</span> : null}
      </span>
      <span className="flex items-center gap-2.5">
        {item.is_required ? (
          <StatusBadge variant="required">Required</StatusBadge>
        ) : item.is_requested ? (
          <StatusBadge variant="requested">Requested</StatusBadge>
        ) : (
          <StatusBadge variant="optional">Optional</StatusBadge>
        )}
        <span
          className={cn(
            "h-[22px] w-[22px] rounded-full grid place-items-center shrink-0 transition-colors border",
            checked ? "bg-brand-400 border-brand-400 text-white" : "border-gray-200",
          )}
        >
          {checked ? <Check className="h-2.5 w-2.5 stroke-[3]" /> : null}
        </span>
      </span>
    </button>
  );
}
