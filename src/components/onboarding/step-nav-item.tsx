"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check } from "lucide-react";
import type { StepDefinition } from "@/lib/config";
import { cn } from "@/lib/utils";

type Props = {
  step: StepDefinition;
  subOverride?: string;
  isComplete: boolean;
};

export function StepNavItem({ step, subOverride, isComplete }: Props) {
  const pathname = usePathname() ?? "";
  const isActive = pathname === `/onboarding/${step.slug}`;
  return (
    <Link
      href={`/onboarding/${step.slug}`}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-md border transition-colors",
        isActive ? "bg-brand-50 border-brand-100" : "border-transparent hover:bg-gray-50",
      )}
    >
      <span
        className={cn(
          "h-8 w-8 rounded-sm grid place-items-center text-[15px] shrink-0",
          isComplete
            ? "bg-success-50 text-success-600"
            : isActive
              ? "bg-brand-100 text-brand-600"
              : "bg-gray-100 text-gray-500",
        )}
      >
        {step.icon}
      </span>
      <span className="flex-1 min-w-0">
        <span className={cn("block text-[13px] font-medium truncate", isActive ? "text-brand-700" : "text-gray-700")}>
          {step.name}
        </span>
        <span className="block text-[11px] text-gray-400 truncate">{subOverride ?? step.sub}</span>
      </span>
      <span
        className={cn(
          "h-[18px] w-[18px] rounded-full grid place-items-center shrink-0 transition-colors",
          isComplete ? "bg-success-400 border border-success-400 text-white" : "border border-gray-200",
        )}
      >
        {isComplete ? <Check className="h-2.5 w-2.5 stroke-[3]" /> : null}
      </span>
    </Link>
  );
}
