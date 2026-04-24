"use server";

import { revalidatePath } from "next/cache";
import { EMPLOYEE_ID, STEP_BY_SLUG } from "@/lib/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { profileSchema, type ProfileInput } from "@/lib/validators";
import { actionError, type ActionResult } from "@/lib/action-result";
import { advanceStepAction } from "../actions";

export async function saveProfileAction(input: ProfileInput): Promise<ActionResult> {
  try {
    const parsed = profileSchema.parse(input);
    const supabase = createSupabaseServerClient();
    const normalized = Object.fromEntries(
      Object.entries(parsed).map(([k, v]) => [k, typeof v === "string" && v.trim() === "" ? null : v]),
    );
    const { error } = await supabase
      .from("onboarding_employees")
      .update({ ...normalized, updated_at: new Date().toISOString() })
      .eq("id", EMPLOYEE_ID);
    if (error) throw error;

    const step = STEP_BY_SLUG["profile"]!;
    await advanceStepAction(step.order);
    revalidatePath("/onboarding", "layout");
    return { ok: true };
  } catch (e) {
    return actionError(e);
  }
}
