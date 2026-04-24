import { cn } from "@/lib/utils";

export type StatusVariant =
  | "required"
  | "optional"
  | "requested"
  | "active"
  | "pending"
  | "scheduled"
  | "overdue";

const variants: Record<StatusVariant, string> = {
  required: "bg-danger-50 text-danger-600",
  optional: "bg-gray-100 text-gray-500",
  requested: "bg-success-50 text-success-600",
  active: "bg-success-50 text-success-600",
  pending: "bg-warning-50 text-warning-600",
  scheduled: "bg-brand-50 text-brand-600",
  overdue: "bg-danger-50 text-danger-600 font-semibold",
};

export function StatusBadge({ variant, children, className }: { variant: StatusVariant; children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill px-2.5 py-[3px] text-[11px] font-medium leading-none",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
