export function formatDate(value: string | null | undefined, opts?: Intl.DateTimeFormatOptions): string {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", opts ?? { month: "short", day: "numeric", year: "numeric" });
}

export function formatShortDate(value: string | null | undefined): string {
  return formatDate(value, { month: "short", day: "numeric" });
}

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const date = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }).toLowerCase().replace(" ", "");
  return `${date} · ${time}`;
}

export function initials(first?: string | null, last?: string | null): string {
  const a = (first ?? "").trim().charAt(0);
  const b = (last ?? "").trim().charAt(0);
  return `${a}${b}`.toUpperCase() || "?";
}

export function fullName(employee: { first_name: string | null; last_name: string | null; preferred_name: string | null }): string {
  const first = employee.preferred_name?.trim() || employee.first_name?.trim() || "";
  const last = employee.last_name?.trim() || "";
  return [first, last].filter(Boolean).join(" ") || "Unnamed employee";
}
