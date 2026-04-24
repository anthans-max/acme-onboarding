import { STEPS } from "@/lib/config";
import type { OnboardingSession } from "@/lib/supabase/types";
import { completedCount, progressPercent } from "@/lib/steps";
import { StepNavItem } from "./step-nav-item";

type Props = {
  session: OnboardingSession;
  counts: {
    systems: { total: number };
    documents: { total: number; done: number };
    equipment: { total: number; done: number };
  };
};

export function OnboardingSidebar({ session, counts }: Props) {
  const done = completedCount(session);
  const pct = progressPercent(session);

  return (
    <aside className="w-full lg:w-[260px] shrink-0 bg-white border-b lg:border-b-0 lg:border-r border-gray-100 lg:sticky lg:top-14 lg:h-[calc(100vh-56px)] overflow-y-auto px-5 py-5 lg:py-7 flex flex-col gap-1.5">
      <div className="px-2 pb-5 mb-2 border-b border-gray-100 flex flex-col gap-2">
        <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-400">Your progress</div>
        <div className="h-1 bg-gray-100 rounded-pill overflow-hidden">
          <div
            className="h-full bg-brand-400 rounded-pill transition-[width] duration-500 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="text-[12px] text-gray-400">
          <span className="font-semibold text-gray-700">{done}</span> of {STEPS.length} steps complete
        </div>
      </div>
      {STEPS.map((step) => {
        const isComplete = session.is_complete || (session.completed_steps ?? []).includes(step.order);
        const subOverride =
          step.slug === "systems"
            ? `${counts.systems.total} tools available`
            : step.slug === "hr-documents"
              ? `${counts.documents.done} of ${counts.documents.total} complete`
              : step.slug === "equipment"
                ? `${counts.equipment.done} of ${counts.equipment.total} confirmed`
                : step.sub;
        return <StepNavItem key={step.slug} step={step} subOverride={subOverride} isComplete={isComplete} />;
      })}
    </aside>
  );
}
