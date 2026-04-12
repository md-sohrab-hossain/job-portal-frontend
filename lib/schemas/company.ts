import { z } from "zod";

export const companySchema = z.object({
  name: z.string().min(1, "Company name is required"),
  description: z.string().optional(),
  website: z.string().url("Invalid website URL").or(z.literal("")).optional(),
  location: z.string().optional(),
  logo: z.string().optional(),
});

export type CompanyInput = z.infer<typeof companySchema>;
