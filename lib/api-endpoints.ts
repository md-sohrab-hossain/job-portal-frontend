const API_BASE = "/api";

// Backend routes exactly as they are defined in the NestJS controllers
const BACKEND_ROUTES = {
  auth: {
    login: "/user/login",
    register: "/user/register",
    logout: "/user/logout",
    refresh: "/user/refreshToken",
  },
  jobs: {
    base: "/job",
    admin: "/job/admin",
    byId: (id: string) => `/job/${id}`,
    favorites: "/job/favorites",
    favorite: (id: string) => `/job/favorite/${id}`,
  },
  companies: {
    base: "/company",
    byId: (id: string) => `/company/${id}`,
  },
  applications: {
    base: "/applications",
    apply: (id: string) => `/applications/${id}`,
    applied: (jobId: string) => `/applications/applied/${jobId}`,
    applicants: (jobId: string) => `/applications/${jobId}/applicants`,
    updateStatus: (id: string) => `/applications/update-status/${id}`,
  },
  user: {
    byId: (id: string) => `/user/${id}`,
    update: "/user/updateProfile",
    me: "/user/me",
  },
};

// Proxy routes (Next.js API routes)
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
    byId: (id: string) => `${API_BASE}/jobs/${id}`,
    favorites: `${API_BASE}/jobs/favorites`,
    favorite: (id: string) => `${API_BASE}/jobs/favorite/${id}`,
  },
  companies: {
    base: `${API_BASE}/company`,
    byId: (id: string) => `${API_BASE}/company/${id}`,
  },
  applications: {
    base: `${API_BASE}/applications`,
    apply: (id: string) => `${API_BASE}/applications/apply/${id}`,
    applied: (jobId: string) => `${API_BASE}/applications/applied/${jobId}`,
    applicants: (jobId: string) =>
      `${API_BASE}/applications/${jobId}/applicants`,
    updateStatus: (id: string) =>
      `${API_BASE}/applications/update-status/${id}`,
  },
  user: {
    byId: (id: string) => `${API_BASE}/user/${id}`,
    update: `${API_BASE}/user/update`,
    me: `${API_BASE}/user/me`,
  },
};

// Raw backend endpoints for server-side direct calls (authFetch)
export const BackendEndpoints = BACKEND_ROUTES;
