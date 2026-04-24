import { StepFooter } from "@/components/onboarding/step-footer";
import { WelcomeHero } from "@/components/onboarding/welcome-hero";
import { ContinueButton } from "@/components/onboarding/continue-button";
import { getOrSeedEmployee } from "@/lib/supabase/queries";
import { STEP_BY_SLUG } from "@/lib/config";

export const dynamic = "force-dynamic";

export default async function WelcomePage() {
  const { employee } = await getOrSeedEmployee();
  const step = STEP_BY_SLUG["welcome"]!;
  return (
    <div>
      <WelcomeHero employee={employee} />
      <StepFooter rightSlot={<ContinueButton fromOrder={step.order} nextHref="/onboarding/profile" label="Get started" />} />
    </div>
  );
}
