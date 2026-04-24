"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/onboarding", label: "Employee view" },
  { href: "/admin", label: "Admin dashboard" },
];

export function TopNav() {
  const pathname = usePathname() ?? "";
  const activeTab = TABS.find((t) => pathname.startsWith(t.href));
  return (
    <header className="sticky top-0 z-50 h-14 bg-white border-b border-gray-100 shadow-[0_1px_3px_rgba(9,13,20,0.04)]">
      <div className="h-full flex items-center justify-between px-6">
        <Link href="/onboarding" className="flex items-center gap-3">
          <span className="h-8 w-8 rounded-sm bg-brand-600 text-white grid place-items-center font-semibold text-[13px]">A</span>
          <span className="text-[15px] font-semibold text-gray-800">Acme Corp</span>
        </Link>
        <nav className="flex items-center gap-1">
          {TABS.map((tab) => {
            const isActive = activeTab?.href === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "px-3.5 py-1.5 rounded-sm text-[13px] font-medium transition-colors",
                  isActive ? "bg-brand-50 text-brand-600" : "text-gray-500 hover:bg-gray-50 hover:text-gray-700",
                )}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center">
          <span className="h-8 w-8 rounded-full bg-brand-100 text-brand-600 grid place-items-center text-[13px] font-semibold">AJ</span>
        </div>
      </div>
    </header>
  );
}
