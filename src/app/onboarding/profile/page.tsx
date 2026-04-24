import { StepHeader } from "@/components/onboarding/step-header";
import { ProfileForm } from "@/components/onboarding/profile-form";
import { getOrSeedEmployee } from "@/lib/supabase/queries";
import { STEP_BY_SLUG } from "@/lib/config";

export default async function ProfilePage() {
  const { employee } = await getOrSeedEmployee();
  const step = STEP_BY_SLUG["profile"]!;
  return (
    <div>
      <StepHeader
        eyebrow={step.eyebrow}
        title="Your profile"
        description="Review your details and fill in anything missing. Pre-filled fields came from your offer letter."
      />
      <ProfileForm employee={employee} />
    </div>
  );
}
