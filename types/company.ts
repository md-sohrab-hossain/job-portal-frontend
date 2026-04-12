export interface Company {
  id: string;
  name: string;
  logo: string;
  description?: string;
  website?: string;
  location?: string;
  createdAt: string;
}

export interface CompanyFormData {
  name: string;
  description?: string;
  website?: string;
  location?: string;
  logo?: string;
}
