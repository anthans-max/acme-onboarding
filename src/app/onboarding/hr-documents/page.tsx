import { StepFooter } from "@/components/onboarding/step-footer";
import { StepHeader } from "@/components/onboarding/step-header";
import { HrDocGrid } from "@/components/onboarding/hr-doc-grid";
import { ContinueButton } from "@/components/onboarding/continue-button";
import { getDocuments, isDocDone } from "@/lib/supabase/queries";
import { STEP_BY_SLUG } from "@/lib/config";

export default async function HrDocumentsPage() {
  const docs = await getDocuments();
  const step = STEP_BY_SLUG["hr-documents"]!;
  const completed = docs.filter((d) => isDocDone(d.status)).length;
  return (
    <div>
      <StepHeader
        eyebrow={step.eyebrow}
        title="HR paperwork"
        description="Complete all required forms before your start date. Tap a card to toggle its status."
      />
      <HrDocGrid docs={docs} />
      <StepFooter
        backHref="/onboarding/systems"
        hint={`${completed} of ${docs.length} completed`}
        rightSlot={<ContinueButton fromOrder={step.order} nextHref="/onboarding/equipment" />}
      />
    </div>
  );
}
