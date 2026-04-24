import { StepFooter } from "@/components/onboarding/step-footer";
import { StepHeader } from "@/components/onboarding/step-header";
import { AccessList } from "@/components/onboarding/access-list";
import { CompleteButton } from "@/components/onboarding/complete-button";
import { getBuildingAccess } from "@/lib/supabase/queries";
import { STEP_BY_SLUG } from "@/lib/config";

export const dynamic = "force-dynamic";

export default async function BuildingAccessPage() {
  const items = await getBuildingAccess();
  const step = STEP_BY_SLUG["building-access"]!;
  return (
    <div>
      <StepHeader
        eyebrow={step.eyebrow}
        title="Building access"
        description="Your access is being provisioned. Pending items will be ready by your start date. Contact IT if anything is missing."
      />
      <AccessList items={items} />
      <StepFooter backHref="/onboarding/equipment" rightSlot={<CompleteButton />} />
    </div>
  );
}
