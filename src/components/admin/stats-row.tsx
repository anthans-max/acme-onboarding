import { cn } from "@/lib/utils";

type Stat = {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  tone?: "default" | "success" | "warning" | "brand";
};

const toneClass: Record<NonNullable<Stat["tone"]>, string> = {
  default: "text-gray-800",
  success: "text-success-600",
  warning: "text-warning-600",
  brand: "text-brand-600",
};

const subToneClass: Record<NonNullable<Stat["tone"]>, string> = {
  default: "text-gray-400",
  success: "text-success-600",
  warning: "text-warning-600",
  brand: "text-brand-600",
};

export function AdminStatsRow({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div key={s.label} className="rounded-lg border border-gray-100 bg-white p-5 shadow-card">
          <div className="text-[12px] font-medium text-gray-400 mb-2">{s.label}</div>
          <div className={cn("text-[28px] font-semibold leading-none mb-1", toneClass[s.tone ?? "default"])}>{s.value}</div>
          {s.sub ? <div className={cn("text-[12px] mt-1", subToneClass[s.tone ?? "default"])}>{s.sub}</div> : null}
        </div>
      ))}
    </div>
  );
}
