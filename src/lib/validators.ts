import { z } from "zod";

export const profileSchema = z.object({
  first_name: z.string().trim().min(1, "Required").max(80),
  last_name: z.string().trim().min(1, "Required").max(80),
  preferred_name: z.string().trim().max(80).optional().or(z.literal("")),
  email: z.string().trim().email("Enter a valid email"),
  pronouns: z.string().trim().max(40).optional().or(z.literal("")),
  mobile_phone: z.string().trim().max(40).optional().or(z.literal("")),
  work_phone_ext: z.string().trim().max(20).optional().or(z.literal("")),
  emergency_contact_name: z.string().trim().max(80).optional().or(z.literal("")),
  emergency_contact_phone: z.string().trim().max(40).optional().or(z.literal("")),
  tshirt_size: z.string().trim().max(10).optional().or(z.literal("")),
  location: z.string().trim().max(80).optional().or(z.literal("")),
});

export type ProfileInput = z.infer<typeof profileSchema>;
