import { cn } from "@/lib/utils";

export type TaskStatus = "done" | "pending" | "overdue";

const dotClass: Record<TaskStatus, string> = {
  done: "bg-success-400",
  pending: "bg-warning-400",
  overdue: "bg-danger-400",
};

export function TaskItem({
  status,
  text,
  date,
  dateTone,
  last,
}: {
  status: TaskStatus;
  text: React.ReactNode;
  date?: React.ReactNode;
  dateTone?: "default" | "overdue";
  last?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-2.5 py-2.5", last ? "" : "border-b border-gray-100")}>
      <span className={cn("h-2 w-2 rounded-full shrink-0", dotClass[status])} />
      <span className="flex-1 text-[13px] text-gray-600">{text}</span>
      {date ? (
        <span className={cn("text-[11px]", dateTone === "overdue" ? "text-danger-600 font-medium" : "text-gray-400")}>{date}</span>
      ) : null}
    </div>
  );
}
