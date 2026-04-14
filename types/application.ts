export interface Applicant {
  id: string;
  fullname: string;
  email: string;
  phoneNumber?: string;
  profilePhoto?: string;
  bio?: string;
  skills?: string[];
  resume?: string;
  resumeOriginalName?: string;
}

export interface Application {
  id: string;
  applicantId?: string;
  status: string;
  createdAt?: string;
  applicant?: Applicant;
}

export interface Job {
  id: string;
  title: string;
  company?: { name: string };
  applications: Application[];
}
