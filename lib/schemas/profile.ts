import { z } from "zod";

export const updateProfileSchema = z.object({
  fullname: z
    .string()
    .min(1, "Full name is required")
    .max(100, "Full name must be less than 100 characters"),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(
      /^\+[1-9]\d{1,14}$/,
      "Phone number must include country code (e.g., +1234567890)"
    ),
  profileBio: z
    .string()
    .max(1000, "Bio must be less than 1000 characters")
    .optional(),
  profileSkills: z.string().optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
