const API_BASE = "/api";

export const Endpoints = {
  auth: {
    login: `${API_BASE}/auth/login`,
    register: `${API_BASE}/auth/register`,
    logout: `${API_BASE}/auth/logout`,
    refresh: `${API_BASE}/auth/refresh`,
  },
  jobs: {
    base: `${API_BASE}/jobs`,
    admin: `${API_BASE}/jobs/admin`,
    apply: (id: string) => `${API_BASE}/jobs/apply/${id}`,
    favorite: (id: string) => `${API_BASE}/jobs/favorite/${id}`,
  },
  companies: {
    base: `${API_BASE}/company`,
  },
  applications: {
    base: `${API_BASE}/applications`,
    applied: (jobId: string) => `${API_BASE}/applications/applied/${jobId}`,
    applicants: (jobId: string) =>
      `${API_BASE}/applications/${jobId}/applicants`,
    updateStatus: (applicationId: string) =>
      `${API_BASE}/applications/update-status/${applicationId}`,
  },
  user: {
    byId: (id: string) => `${API_BASE}/user/${id}`,
  },
};
