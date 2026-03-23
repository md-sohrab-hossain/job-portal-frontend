import { z } from "zod";

export const registerSchema = z.object({
  fullname: z
    .string()
    .min(1, "Full name is required")
    .max(100, "Full name must be less than 100 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(
      /^\+[1-9]\d{1,14}$/,
      "Phone number must include country code (e.g., +1234567890)"
    ),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
    .regex(/[a-z]/, "Password must contain at least 1 lowercase letter")
    .regex(/[0-9]/, "Password must contain at least 1 number")
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least 1 special character"
    ),
  profileBio: z.string().optional(),
  profileSkills: z.array(z.string()).optional(),
  profileResume: z.string().url().optional(),
  profilePhoto: z.string().url().optional(),
  role: z.enum(["student", "recruiter"], {
    message: "Please select a valid role",
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>;
