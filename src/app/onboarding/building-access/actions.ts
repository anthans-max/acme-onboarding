"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { EMPLOYEE_ID, STEP_BY_SLUG } from "@/lib/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { OnboardingSession } from "@/lib/supabase/types";
import { actionError, type ActionResult } from "@/lib/action-result";

export async function completeOnboardingAction(): Promise<ActionResult> {
  try {
    const supabase = createSupabaseServerClient();
    const { data: session, error } = await supabase
      .from("onboarding_sessions")
      .select("*")
      .eq("employee_id", EMPLOYEE_ID)
      .single();
    if (error) throw error;
    const s = session as OnboardingSession;
    const step = STEP_BY_SLUG["building-access"]!;
    const completed = new Set(s.completed_steps ?? []);
    completed.add(step.order);
    const now = new Date().toISOString();
    const { error: updateError } = await supabase
      .from("onboarding_sessions")
      .update({
        completed_steps: Array.from(completed).sort((a, b) => a - b),
        current_step: step.order,
        is_complete: true,
        submitted_at: now,
        last_activity_at: now,
      })
      .eq("id", s.id);
    if (updateError) throw updateError;
    revalidatePath("/onboarding", "layout");
  } catch (e) {
    return actionError(e);
  }
  redirect("/onboarding/complete");
}
