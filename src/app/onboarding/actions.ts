"use server";

import { revalidatePath } from "next/cache";
import { EMPLOYEE_ID, STEPS } from "@/lib/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { OnboardingSession } from "@/lib/supabase/types";
import { actionError, type ActionResult } from "@/lib/action-result";

export async function advanceStepAction(fromOrder: number): Promise<ActionResult> {
  try {
    const supabase = createSupabaseServerClient();
    const { data: session, error } = await supabase
      .from("onboarding_sessions")
      .select("*")
      .eq("employee_id", EMPLOYEE_ID)
      .single();
    if (error) throw error;
    const s = session as OnboardingSession;
    const completed = new Set(s.completed_steps ?? []);
    completed.add(fromOrder);
    const nextStep = Math.min(fromOrder + 1, STEPS.length - 1);
    const { error: updateError } = await supabase
      .from("onboarding_sessions")
      .update({
        completed_steps: Array.from(completed).sort((a, b) => a - b),
        current_step: Math.max(s.current_step ?? 0, nextStep),
        last_activity_at: new Date().toISOString(),
      })
      .eq("id", s.id);
    if (updateError) throw updateError;
    revalidatePath("/onboarding", "layout");
    return { ok: true };
  } catch (e) {
    return actionError(e);
  }
}
