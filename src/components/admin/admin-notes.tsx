"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { saveAdminNoteAction } from "@/app/admin/[id]/actions";

export function AdminNotes({ employeeId }: { employeeId: string }) {
  const [note, setNote] = useState("");
  const [pending, startTransition] = useTransition();
  return (
    <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-card">
      <div className="text-[12px] font-semibold uppercase tracking-[0.06em] text-gray-400 mb-2">Admin notes</div>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Add a note visible only to HR/IT admins…"
        className="w-full h-20 p-2.5 border border-gray-200 rounded-md text-[13px] leading-relaxed resize-none outline-none focus:border-brand-400"
      />
      <button
        type="button"
        disabled={pending || !note.trim()}
        onClick={() =>
          startTransition(async () => {
            const r = await saveAdminNoteAction(employeeId, note);
            if (r.ok) {
              toast.success("Note saved");
              setNote("");
            } else {
              toast.error(r.error || "Couldn't save");
            }
          })
        }
        className="mt-2 w-full inline-flex justify-center items-center gap-1.5 text-[12px] font-medium text-gray-600 hover:text-gray-800 disabled:opacity-60"
      >
        {pending ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
        Save note
      </button>
      <p className="text-[11px] text-gray-400 mt-2 leading-relaxed">
        Note: persistence stub until an <code className="font-mono text-[10.5px]">admin_notes</code> column is added to the schema.
      </p>
    </div>
  );
}
