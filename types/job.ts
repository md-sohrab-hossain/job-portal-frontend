export interface Company {
  name: string;
  logo?: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  position: number;
  jobType: string;
  salary: number;
  company: Company;
}

export interface Application {
  applicantId: string | number;
  appliedAt?: string;
}

export interface JobDetail extends Omit<Job, "company"> {
  location: string;
  requirements: string[];
  experienceLevel: number;
  applications: Application[];
  createdAt: string;
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
  requirements: string;
  salary: number;
  location: string;
  jobType: string;
  experienceLevel: number;
  position: number;
  companyId: string;
}
