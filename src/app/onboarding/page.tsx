import { redirect } from "next/navigation";
import { getOrSeedEmployee } from "@/lib/supabase/queries";
import { stepForSession } from "@/lib/steps";

export default async function OnboardingIndex() {
  const { session } = await getOrSeedEmployee();
  if (session.is_complete) redirect("/onboarding/complete");
  const step = stepForSession(session);
  redirect(`/onboarding/${step.slug}`);
}
