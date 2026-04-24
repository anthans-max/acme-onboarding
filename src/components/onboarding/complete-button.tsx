"use client";

import { useTransition } from "react";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { completeOnboardingAction } from "@/app/onboarding/building-access/actions";

export function CompleteButton() {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          const result = await completeOnboardingAction();
          if (result && !result.ok) toast.error(result.error || "Couldn't complete");
        })
      }
      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-sm bg-success-400 hover:bg-success-600 text-white text-[13px] font-medium transition-colors disabled:opacity-70"
    >
      Complete onboarding
      {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5 stroke-[3]" />}
    </button>
  );
}
