"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

const CHIPS = [
  { value: "all", label: "All employees" },
  { value: "in_progress", label: "In progress" },
  { value: "completed", label: "Completed" },
  { value: "attention", label: "Needs attention" },
  { value: "this_week", label: "Starting this week" },
];

export function EmployeeFilters() {
  const router = useRouter();
  const params = useSearchParams();
  const [, startTransition] = useTransition();
  const activeFilter = params.get("filter") ?? "all";
  const query = params.get("q") ?? "";

  function updateParams(patch: Record<string, string | null>) {
    const sp = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(patch)) {
      if (v === null || v === "") sp.delete(k);
      else sp.set(k, v);
    }
    const qs = sp.toString();
    startTransition(() => router.replace(qs ? `/admin?${qs}` : "/admin", { scroll: false }));
  }

  return (
    <div className="flex items-center gap-2.5 flex-wrap">
      {CHIPS.map((chip) => {
        const isActive = activeFilter === chip.value;
        return (
          <button
            key={chip.value}
            type="button"
            onClick={() => updateParams({ filter: chip.value === "all" ? null : chip.value })}
            className={cn(
              "px-3.5 py-1.5 rounded-pill text-[13px] font-medium border transition-colors",
              isActive ? "bg-brand-50 border-brand-200 text-brand-600" : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50",
            )}
          >
            {chip.label}
          </button>
        );
      })}
      <div className="ml-auto relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
        <input
          type="search"
          defaultValue={query}
          onChange={(e) => updateParams({ q: e.target.value })}
          placeholder="Search by name or dept…"
          className="h-9 pl-9 pr-3 min-w-[200px] border border-gray-200 rounded-md text-[13px] outline-none focus:border-brand-400 bg-white"
        />
      </div>
    </div>
  );
}
