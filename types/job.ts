import { type Company } from "@/types/company";

export interface Job {
  id: string;
  title: string;
  description: string;
  position: number;
  jobType: string;
  salary: number;
  company: Company;
  createdAt?: string;
  location?: string;
  requirements?: string[];
  experienceLevel?: string;
  applications?: Application[];
}

export interface Application {
  id: string;
  applicantId: string;
  appliedAt?: string;
}

export interface JobDetail extends Omit<Job, "company" | "applications"> {
  location: string;
  requirements: string[];
  experienceLevel: string;
  applications: Application[];
  createdAt: string;
  company: Company;
  profileSkills?: string[];
}

export interface JobDetailsProps {
  job: JobDetail;
  jobId: string;
}

export interface JobResponse {
  data?: JobDetail;
  message?: string;
  success?: boolean;
}

export interface JobFormData {
  title: string;
  description: string;
  requirements: string; // Comma-separated string in form
  salary: number;
  location: string;
  jobType: string;
  experienceLevel: string;
  position: number;
  companyId: string;
}
