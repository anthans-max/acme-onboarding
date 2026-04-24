"use server";

import { revalidatePath } from "next/cache";
import { EMPLOYEE_ID } from "@/lib/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { DocumentStatus } from "@/lib/supabase/types";
import { actionError, type ActionResult } from "@/lib/action-result";

export async function markDocumentAction(docId: string, status: DocumentStatus): Promise<ActionResult> {
  try {
    const supabase = createSupabaseServerClient();
    const completed_at = status === "completed" || status === "signed" ? new Date().toISOString() : null;
    const { error } = await supabase
      .from("onboarding_hr_documents")
      .update({ status, completed_at, updated_at: new Date().toISOString() })
      .eq("id", docId)
      .eq("employee_id", EMPLOYEE_ID);
    if (error) throw error;
    revalidatePath("/onboarding", "layout");
    return { ok: true };
  } catch (e) {
    return actionError(e);
  }
}
