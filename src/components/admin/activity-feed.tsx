import { formatDateTime } from "@/lib/format";

export type ActivityEvent = {
  id: string;
  icon: string;
  text: string;
  timestamp: string;
};

export function ActivityFeed({ events }: { events: ActivityEvent[] }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-card">
      <div className="text-[12px] font-semibold uppercase tracking-[0.06em] text-gray-400 mb-2">Recent activity</div>
      {events.length === 0 ? (
        <div className="text-[13px] text-gray-400 py-3">No activity yet.</div>
      ) : (
        <div className="flex flex-col">
          {events.map((e, i) => (
            <div key={e.id} className={`flex gap-3 py-2.5 ${i < events.length - 1 ? "border-b border-gray-100" : ""}`}>
              <span className="h-7 w-7 rounded-full bg-gray-100 grid place-items-center text-[12px] shrink-0 mt-0.5">{e.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] text-gray-600 leading-relaxed">{e.text}</div>
                <div className="text-[11px] text-gray-400 mt-0.5">{formatDateTime(e.timestamp)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
