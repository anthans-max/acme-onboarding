export const EMPLOYEE_ID = "f290e91a-229c-4b4a-90b9-9275f6ece756";

export type StepSlug =
  | "welcome"
  | "profile"
  | "systems"
  | "hr-documents"
  | "equipment"
  | "building-access"
  | "complete";

export type StepDefinition = {
  slug: StepSlug;
  order: number;
  name: string;
  sub: string;
  icon: string;
  eyebrow: string | null;
};

export const STEPS: StepDefinition[] = [
  { slug: "welcome", order: 0, name: "Welcome", sub: "Getting started", icon: "👋", eyebrow: null },
  { slug: "profile", order: 1, name: "Your profile", sub: "Personal details", icon: "👤", eyebrow: "STEP 1 OF 5" },
  { slug: "systems", order: 2, name: "System access", sub: "8 tools available", icon: "💻", eyebrow: "STEP 2 OF 5" },
  { slug: "hr-documents", order: 3, name: "HR paperwork", sub: "8 forms to complete", icon: "📄", eyebrow: "STEP 3 OF 5" },
  { slug: "equipment", order: 4, name: "Equipment", sub: "7 items to confirm", icon: "📦", eyebrow: "STEP 4 OF 5" },
  { slug: "building-access", order: 5, name: "Building access", sub: "Status overview", icon: "🏢", eyebrow: "STEP 5 OF 5" },
];

export const STEP_BY_SLUG: Record<StepSlug, StepDefinition | undefined> = STEPS.reduce(
  (acc, step) => {
    acc[step.slug] = step;
    return acc;
  },
  {} as Record<StepSlug, StepDefinition | undefined>,
);

export const TOTAL_FORM_STEPS = 5;
