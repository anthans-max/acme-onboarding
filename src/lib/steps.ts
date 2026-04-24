import { STEPS, STEP_BY_SLUG, type StepDefinition, type StepSlug } from "./config";
import type { OnboardingSession } from "./supabase/types";

export function stepForSession(session: OnboardingSession): StepDefinition {
  const idx = Math.min(Math.max(session.current_step ?? 0, 0), STEPS.length - 1);
  return STEPS[idx];
}

export function nextStep(current: StepSlug): StepDefinition | null {
  const cur = STEP_BY_SLUG[current];
  if (!cur) return null;
  return STEPS.find((s) => s.order === cur.order + 1) ?? null;
}

export function prevStep(current: StepSlug): StepDefinition | null {
  const cur = STEP_BY_SLUG[current];
  if (!cur) return null;
  return STEPS.find((s) => s.order === cur.order - 1) ?? null;
}

export function isStepComplete(session: OnboardingSession, order: number): boolean {
  if (session.is_complete) return true;
  return (session.completed_steps ?? []).includes(order);
}

export function progressPercent(session: OnboardingSession): number {
  if (session.is_complete) return 100;
  const completed = session.completed_steps?.length ?? 0;
  return Math.round((completed / STEPS.length) * 100);
}

export function completedCount(session: OnboardingSession): number {
  if (session.is_complete) return STEPS.length;
  return session.completed_steps?.length ?? 0;
}
