"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { saveProfileAction } from "@/app/onboarding/profile/actions";
import { profileSchema, type ProfileInput } from "@/lib/validators";
import type { Employee } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

const PRONOUN_OPTIONS = [
  { value: "", label: "Prefer not to say" },
  { value: "He / Him", label: "He / Him" },
  { value: "She / Her", label: "She / Her" },
  { value: "They / Them", label: "They / Them" },
];

const TSHIRT_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL"];
const LOCATION_OPTIONS = ["Los Angeles (HQ)", "New York", "Remote"];

export function ProfileForm({ employee }: { employee: Employee }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const defaultValues: ProfileInput = {
    first_name: employee.first_name ?? "",
    last_name: employee.last_name ?? "",
    preferred_name: employee.preferred_name ?? "",
    email: employee.email ?? "",
    pronouns: employee.pronouns ?? "",
    mobile_phone: employee.mobile_phone ?? "",
    work_phone_ext: employee.work_phone_ext ?? "",
    emergency_contact_name: employee.emergency_contact_name ?? "",
    emergency_contact_phone: employee.emergency_contact_phone ?? "",
    tshirt_size: employee.tshirt_size ?? "",
    location: employee.location ?? "",
  };
  const form = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues,
  });

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const result = await saveProfileAction(values);
      if (!result.ok) {
        toast.error(result.error || "Couldn't save");
        return;
      }
      toast.success("Profile saved");
      router.push("/onboarding/systems");
    });
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Card title="Personal information">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="First name" error={form.formState.errors.first_name?.message}>
            <input {...form.register("first_name")} className={inputCls(!!employee.first_name)} />
          </Field>
          <Field label="Last name" error={form.formState.errors.last_name?.message}>
            <input {...form.register("last_name")} className={inputCls(!!employee.last_name)} />
          </Field>
          <Field label="Preferred name" optional>
            <input {...form.register("preferred_name")} placeholder="What should we call you?" className={inputCls()} />
          </Field>
          <Field label="Work email" error={form.formState.errors.email?.message}>
            <input {...form.register("email")} type="email" className={inputCls(!!employee.email, true)} />
          </Field>
          <Field label="Pronouns" optional>
            <select {...form.register("pronouns")} className={inputCls()}>
              {PRONOUN_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Mobile phone">
            <input {...form.register("mobile_phone")} placeholder="+1 (___) ___-____" className={inputCls()} />
          </Field>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <Field label="Work extension">
            <input {...form.register("work_phone_ext")} placeholder="e.g. 4821" className={inputCls()} />
          </Field>
        </div>
      </Card>

      <Card title="Emergency contact">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Contact name">
            <input {...form.register("emergency_contact_name")} placeholder="Full name" className={inputCls()} />
          </Field>
          <Field label="Contact phone">
            <input {...form.register("emergency_contact_phone")} placeholder="+1 (___) ___-____" className={inputCls()} />
          </Field>
        </div>
      </Card>

      <Card title="Preferences">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="T-shirt size" hint="for company swag">
            <select {...form.register("tshirt_size")} className={inputCls()}>
              <option value="">Select size</option>
              {TSHIRT_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Office location">
            <select {...form.register("location")} className={inputCls()}>
              <option value="">Select location</option>
              {LOCATION_OPTIONS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </Card>

      <div className="flex items-center justify-between gap-4 pt-5 mt-2 border-t border-gray-100">
        <button
          type="button"
          onClick={() => router.push("/onboarding/welcome")}
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </button>
        <span className="text-[12px] text-gray-400">Auto-saves on continue</span>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-sm bg-brand-600 hover:bg-brand-800 text-white text-[13px] font-medium transition-colors disabled:opacity-70"
        >
          Save & continue
          {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ArrowRight className="h-3.5 w-3.5" />}
        </button>
      </div>
    </form>
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

function Field({
  label,
  optional,
  hint,
  error,
  children,
}: {
  label: string;
  optional?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[13px] font-medium text-gray-600 flex items-baseline gap-1.5">
        {label}
        {optional ? <span className="text-[11px] text-gray-400 font-normal">Optional</span> : null}
        {hint ? <span className="text-[11px] text-gray-400 font-normal">({hint})</span> : null}
      </span>
      {children}
      {error ? <span className="text-[11px] text-danger-600">{error}</span> : null}
    </label>
  );
}

function inputCls(filled?: boolean, prefilled?: boolean): string {
  return cn(
    "h-10 px-3 rounded-md border text-[14px] text-gray-700 bg-white outline-none transition-all",
    "focus:border-brand-400 focus:shadow-[0_0_0_3px_var(--brand-50)]",
    filled && !prefilled && "border-gray-300 bg-gray-50",
    prefilled && "border-success-400 bg-success-50 text-success-800",
    !filled && !prefilled && "border-gray-200",
  );
}
