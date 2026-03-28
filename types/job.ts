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
