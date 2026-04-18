export interface Company {
  id: string;
  _id?: string;
  name: string;
  logo: string;
  description?: string;
  website?: string;
  location?: string;
  createdAt: string;
}

export interface CompanyFormData {
  id?: string;
  name: string;
  description?: string;
  website?: string;
  location?: string;
  logo?: string;
}
