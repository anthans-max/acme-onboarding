"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { advanceStepAction } from "@/app/onboarding/actions";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Props = {
  fromOrder: number;
  nextHref: string;
  label?: string;
  variant?: "primary" | "success";
};

export function ContinueButton({ fromOrder, nextHref, label = "Continue", variant = "primary" }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          const result = await advanceStepAction(fromOrder);
          if (!result.ok) {
            toast.error(result.error || "Something went wrong");
            return;
          }
          router.push(nextHref);
        });
      }}
      className={cn(
        "inline-flex items-center gap-1.5 px-5 py-2.5 rounded-sm text-[13px] font-medium transition-colors disabled:opacity-70",
        variant === "success"
          ? "bg-success-400 hover:bg-success-600 text-white"
          : "bg-brand-600 hover:bg-brand-800 text-white",
      )}
    >
      {label}
      {pending ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : variant === "success" ? (
        <Check className="h-3.5 w-3.5 stroke-[3]" />
      ) : (
        <ArrowRight className="h-3.5 w-3.5" />
      )}
    </button>
  );
}
