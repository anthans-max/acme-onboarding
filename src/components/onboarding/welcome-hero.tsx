import { fullName, formatDate } from "@/lib/format";
import type { Employee } from "@/lib/supabase/types";

type StepCard = { num: string; name: string; desc: string };

const STEP_CARDS: StepCard[] = [
  { num: "Step 1", name: "Your profile", desc: "Confirm personal info and emergency contact" },
  { num: "Step 2–3", name: "Access & paperwork", desc: "Request system access and complete HR forms" },
  { num: "Step 4–5", name: "Equipment & access", desc: "Confirm your equipment and building access" },
];

export function WelcomeHero({ employee }: { employee: Employee }) {
  const first = employee.preferred_name?.trim() || employee.first_name?.trim() || "there";
  const metaItems = [
    { label: "Start date", value: formatDate(employee.start_date) || "—" },
    { label: "Department", value: employee.department ?? "—" },
    { label: "Role", value: employee.job_title ?? "—" },
    { label: "Location", value: employee.location ?? "—" },
  ];
  return (
    <div className="mb-6">
      <div
        className="rounded-2xl text-white p-10 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, var(--brand-600) 0%, var(--brand-800) 100%)" }}
      >
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/5" />
        <div className="absolute -bottom-24 right-10 w-40 h-40 rounded-full bg-white/[0.04]" />
        <div className="relative">
          <div className="text-[12px] uppercase tracking-[0.06em] opacity-70 mb-3 font-medium">Day 1 Onboarding</div>
          <h1 className="text-[32px] font-semibold leading-tight mb-3">Welcome to Acme, {first}! 🎉</h1>
          <p className="text-[15px] opacity-80 leading-relaxed max-w-[420px] mb-7">
            We&rsquo;re thrilled to have you join the {employee.department ?? "team"} team. This quick flow walks you through everything you need to hit the ground running.
          </p>
          <div className="flex gap-6 flex-wrap">
            {metaItems.map((item) => (
              <div key={item.label} className="flex flex-col gap-0.5">
                <div className="text-[11px] uppercase tracking-[0.06em] opacity-60">{item.label}</div>
                <div className="text-[14px] font-medium">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
        {STEP_CARDS.map((card) => (
          <div key={card.num} className="rounded-lg border border-gray-100 bg-white p-5 shadow-card">
            <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-brand-400 mb-2">{card.num}</div>
            <div className="text-[14px] font-medium text-gray-700 mb-1">{card.name}</div>
            <div className="text-[12px] text-gray-400 leading-relaxed">{card.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function greeting({ preferred_name, first_name }: Employee): string {
  return fullName({ preferred_name, first_name, last_name: null });
}
