import { StepFooter } from "@/components/onboarding/step-footer";
import { StepHeader } from "@/components/onboarding/step-header";
import { EquipmentList } from "@/components/onboarding/equipment-list";
import { ContinueButton } from "@/components/onboarding/continue-button";
import { getEquipment } from "@/lib/supabase/queries";
import { STEP_BY_SLUG } from "@/lib/config";

export default async function EquipmentPage() {
  const items = await getEquipment();
  const step = STEP_BY_SLUG["equipment"]!;
  const received = items.filter((i) => i.is_received).length;
  return (
    <div>
      <StepHeader
        eyebrow={step.eyebrow}
        title="Equipment checklist"
        description="Confirm what you've received. IT will follow up on any unchecked items within 24 hours."
      />
      <EquipmentList items={items} />
      <StepFooter
        backHref="/onboarding/hr-documents"
        hint={`${received} of ${items.length} confirmed`}
        rightSlot={<ContinueButton fromOrder={step.order} nextHref="/onboarding/building-access" />}
      />
    </div>
  );
}
