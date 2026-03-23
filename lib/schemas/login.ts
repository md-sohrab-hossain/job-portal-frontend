import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  role: z.enum(["student", "recruiter"], {
    message: "Please select a valid role",
  }),
});

export type LoginInput = z.infer<typeof loginSchema>;
