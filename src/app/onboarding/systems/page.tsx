import { StepFooter } from "@/components/onboarding/step-footer";
import { StepHeader } from "@/components/onboarding/step-header";
import { SystemList } from "@/components/onboarding/system-list";
import { ContinueButton } from "@/components/onboarding/continue-button";
import { getSystems } from "@/lib/supabase/queries";
import { STEP_BY_SLUG } from "@/lib/config";

export const dynamic = "force-dynamic";

export default async function SystemsPage() {
  const systems = await getSystems();
  const step = STEP_BY_SLUG["systems"]!;
  const selected = systems.filter((s) => s.is_required || s.is_requested).length;
  return (
    <div>
      <StepHeader
        eyebrow={step.eyebrow}
        title="System access"
        description="Select the tools you'll need. Required systems are pre-checked. IT will provision access within 1 business day."
      />
      <SystemList items={systems} />
      <StepFooter
        backHref="/onboarding/profile"
        hint={`${selected} of ${systems.length} selected`}
        rightSlot={<ContinueButton fromOrder={step.order} nextHref="/onboarding/hr-documents" />}
      />
    </div>
  );
}
