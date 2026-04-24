import Link from "next/link";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  backHref?: string;
  continueHref?: string;
  continueLabel?: string;
  continueVariant?: "primary" | "success";
  hint?: string | null;
  rightSlot?: React.ReactNode;
};

export function StepFooter({
  backHref,
  continueHref,
  continueLabel = "Continue",
  continueVariant = "primary",
  hint,
  rightSlot,
}: Props) {
  return (
    <div className="flex items-center justify-between gap-4 pt-5 mt-2 border-t border-gray-100">
      <div className="flex-1">
        {backHref ? (
          <Link
            href={backHref}
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </Link>
        ) : null}
      </div>
      <div className="text-[12px] text-gray-400">{hint}</div>
      <div className="flex-1 flex justify-end">
        {rightSlot ??
          (continueHref ? (
            <Link
              href={continueHref}
              className={cn(
                "inline-flex items-center gap-1.5 px-5 py-2.5 rounded-sm text-[13px] font-medium transition-colors",
                continueVariant === "success"
                  ? "bg-success-400 hover:bg-success-600 text-white"
                  : "bg-brand-600 hover:bg-brand-800 text-white",
              )}
            >
              {continueLabel}
              {continueVariant === "success" ? (
                <Check className="h-3.5 w-3.5 stroke-[3]" />
              ) : (
                <ArrowRight className="h-3.5 w-3.5" />
              )}
            </Link>
          ) : null)}
      </div>
    </div>
  );
}
