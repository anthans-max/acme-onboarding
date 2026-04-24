import { TaskItem, type TaskStatus } from "@/components/shared/task-item";

export type SectionItem = {
  id: string;
  status: TaskStatus;
  text: React.ReactNode;
  date?: React.ReactNode;
  dateTone?: "default" | "overdue";
};

export function DetailSection({ title, items }: { title: string; items: SectionItem[] }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-card">
      <div className="text-[12px] font-semibold uppercase tracking-[0.06em] text-gray-400 mb-2">{title}</div>
      {items.length === 0 ? (
        <div className="text-[13px] text-gray-400 py-3">None yet.</div>
      ) : (
        <div className="flex flex-col">
          {items.map((item, i) => (
            <TaskItem
              key={item.id}
              status={item.status}
              text={item.text}
              date={item.date}
              dateTone={item.dateTone}
              last={i === items.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
