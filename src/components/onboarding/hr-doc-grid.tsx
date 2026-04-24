"use client";

import { useOptimistic, useTransition } from "react";
import { toast } from "sonner";
import { markDocumentAction } from "@/app/onboarding/hr-documents/actions";
import type { DocumentStatus, HrDocument } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";
import { formatShortDate } from "@/lib/format";

function isDocDone(status: DocumentStatus): boolean {
  return status === "completed" || status === "signed";
}

const CATEGORY_ORDER: { title: string; match: (key: string) => boolean }[] = [
  { title: "Payroll & compensation", match: (k) => ["direct_deposit", "tax_withholding", "tax_w4", "401k", "retirement"].some((s) => k.includes(s)) },
  { title: "Benefits enrollment", match: (k) => ["health", "dental", "vision", "benefits"].some((s) => k.includes(s)) },
  { title: "Legal & compliance", match: (k) => ["i9", "i-9", "offer", "nda", "ip", "compliance"].some((s) => k.includes(s)) },
];

export function HrDocGrid({ docs }: { docs: HrDocument[] }) {
  const [optimistic, setOptimistic] = useOptimistic<HrDocument[], { id: string; status: DocumentStatus }>(
    docs,
    (state, patch) =>
      state.map((d) =>
        d.id === patch.id
          ? { ...d, status: patch.status, completed_at: isDocDone(patch.status) ? new Date().toISOString() : null }
          : d,
      ),
  );
  const [, startTransition] = useTransition();

  function toggle(doc: HrDocument) {
    const next: DocumentStatus = isDocDone(doc.status) ? "pending" : "completed";
    startTransition(async () => {
      setOptimistic({ id: doc.id, status: next });
      const result = await markDocumentAction(doc.id, next);
      if (!result.ok) toast.error(result.error || "Couldn't update");
    });
  }

  const grouped = groupDocs(optimistic);

  return (
    <div className="flex flex-col gap-4">
      {grouped.map(({ title, items }) => (
        <Card key={title} title={title}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {items.map((doc) => (
              <DocCard key={doc.id} doc={doc} onClick={() => toggle(doc)} />
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-card">
      <div className="text-[13px] font-semibold uppercase tracking-[0.06em] text-gray-500 mb-4">{title}</div>
      {children}
    </div>
  );
}

function DocCard({ doc, onClick }: { doc: HrDocument; onClick: () => void }) {
  const complete = isDocDone(doc.status);
  const overdue = false;
  const statusText = complete
    ? `✓ Completed ${formatShortDate(doc.completed_at)}`.trim()
    : overdue
      ? "Overdue"
      : "Tap to complete →";
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={complete}
      aria-label={`${complete ? "Mark pending" : "Mark completed"}: ${doc.document_name}`}
      onClick={onClick}
      className={cn(
        "rounded-md border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-1",
        complete
          ? "border-success-400 bg-success-50"
          : overdue
            ? "border-danger-400 bg-danger-50"
            : "border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50",
      )}
    >
      <div className="text-[22px] mb-2">{doc.document_icon ?? "📄"}</div>
      <div className={cn("text-[13px] font-medium mb-1", complete ? "text-success-800" : overdue ? "text-danger-600" : "text-gray-700")}>
        {doc.document_name}
      </div>
      <div className={cn("text-[11px]", complete ? "text-success-600" : overdue ? "text-danger-600" : "text-gray-400")}>{statusText}</div>
    </button>
  );
}

function groupDocs(docs: HrDocument[]): { title: string; items: HrDocument[] }[] {
  const claimed = new Set<string>();
  const groups: { title: string; items: HrDocument[] }[] = CATEGORY_ORDER.map(({ title, match }) => {
    const items = docs.filter((d) => match(d.document_key.toLowerCase()));
    items.forEach((d) => claimed.add(d.id));
    return { title, items };
  }).filter((g) => g.items.length > 0);
  const rest = docs.filter((d) => !claimed.has(d.id));
  if (rest.length) groups.push({ title: "Other", items: rest });
  return groups;
}
