"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { actionError, type ActionResult } from "@/lib/action-result";

export async function markCompleteAction(employeeId: string): Promise<ActionResult> {
  try {
    const supabase = createSupabaseServerClient();
    const now = new Date().toISOString();
    const { error } = await supabase
      .from("onboarding_sessions")
      .update({
        is_complete: true,
        submitted_at: now,
        last_activity_at: now,
        completed_steps: [0, 1, 2, 3, 4, 5],
        current_step: 5,
      })
      .eq("employee_id", employeeId);
    if (error) throw error;
    revalidatePath(`/admin/${employeeId}`);
    revalidatePath("/admin");
    return { ok: true };
  } catch (e) {
    return actionError(e);
  }
}

export async function sendReminderAction(employeeId: string): Promise<ActionResult> {
  void employeeId;
  await new Promise((r) => setTimeout(r, 400));
  return { ok: true };
}

// Persistence stub: schema lacks an admin_notes column. Add
// `admin_notes text` to onboarding_sessions or onboarding_employees to persist.
export async function saveAdminNoteAction(employeeId: string, note: string): Promise<ActionResult> {
  void employeeId;
  void note;
  return { ok: true };
}
