import { cn } from "@/lib/utils";

type Props = {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  tone?: "default" | "success" | "warning" | "brand";
  className?: string;
};

const tones: Record<NonNullable<Props["tone"]>, string> = {
  default: "text-gray-800",
  success: "text-success-600",
  warning: "text-warning-600",
  brand: "text-brand-600",
};

export function StatCard({ label, value, sub, tone = "default", className }: Props) {
  return (
    <div className={cn("rounded-md border border-gray-100 bg-white p-5 shadow-card", className)}>
      <div className="text-[12px] font-medium text-gray-400 mb-2">{label}</div>
      <div className={cn("text-[28px] font-semibold leading-none mb-1", tones[tone])}>{value}</div>
      {sub ? <div className="text-[12px] text-gray-400 mt-1">{sub}</div> : null}
    </div>
  );
}
