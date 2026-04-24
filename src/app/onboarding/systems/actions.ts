"use server";

import { revalidatePath } from "next/cache";
import { EMPLOYEE_ID } from "@/lib/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { actionError, type ActionResult } from "@/lib/action-result";

export async function toggleSystemAction(accessId: string, requested: boolean): Promise<ActionResult> {
  try {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase
      .from("onboarding_system_access")
      .update({ is_requested: requested, updated_at: new Date().toISOString() })
      .eq("id", accessId)
      .eq("employee_id", EMPLOYEE_ID);
    if (error) throw error;
    revalidatePath("/onboarding", "layout");
    return { ok: true };
  } catch (e) {
    return actionError(e);
  }
}
