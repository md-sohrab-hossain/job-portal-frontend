import { z } from "zod";

export const jobSchema = z.object({
  title: z.string().min(1, "Job title is required"),
  description: z.string().min(10, "Description should be at least 10 characters"),
  requirements: z.string().min(1, "Requirements are required (comma separated)"),
  salary: z.coerce.number().min(0, "Salary must be a positive number"),
  location: z.string().min(1, "Location is required"),
  jobType: z.string().min(1, "Job type is required"),
  experienceLevel: z.string().min(1, "Experience level is required"),
  position: z.coerce.number().min(1, "At least 1 position is required"),
  companyId: z.string().min(1, "Please select a company"),
});

export type JobInput = z.infer<typeof jobSchema>;
