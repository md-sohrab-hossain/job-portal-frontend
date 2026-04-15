export interface Applicant {
  id: string;
  fullname: string;
  email: string;
  phoneNumber?: string;
  profilePhoto?: string;
  profileBio?: string;
  profileSkills?: string[];
  profileResume?: string;
  profileResumeOriginalName?: string;
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
