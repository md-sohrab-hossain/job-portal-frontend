import { ApiResponse } from "@/types/api";
import { API_URL } from "./constants";

// -- Token Refresh State --
let isRefreshing = false;
let refreshSubscribers: (() => void)[] = [];

async function refreshToken(): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/user/refresh`, {
      method: "POST",
      credentials: "include",
    });
    return res.ok;
  } catch {
    return false;
  }
}

// -- Core Fetch Utility (client-side, with token refresh) --
async function nextFetch<T>(
  path: string,
  options: RequestInit & { timeout?: number } = {},
  retry = true,
): Promise<ApiResponse<T>> {
  const { timeout = 15000, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(path, {
      ...fetchOptions,
      signal: controller.signal,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(fetchOptions.headers as Record<string, string>),
      },
    });

    clearTimeout(timeoutId);

    // On 401: attempt token refresh once, then retry the original request
    if (response.status === 401 && retry) {
      if (!isRefreshing) {
        isRefreshing = true;
        const refreshed = await refreshToken();
        isRefreshing = false;

        if (refreshed) {
          refreshSubscribers.forEach((cb) => cb());
          refreshSubscribers = [];
          return nextFetch<T>(path, options, false);
        }
      } else {
        // Another request is already refreshing — queue up and wait
        return new Promise((resolve) => {
          refreshSubscribers.push(() => resolve(nextFetch<T>(path, options, false)));
        });
      }
    }

    const data = await response.json();
    return { success: response.ok, statusCode: response.status, ...data };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      return { success: false, statusCode: 408, error: "Request timeout" };
    }
    return { success: false, statusCode: 500, error: "Network error" };
  }
}

// -- CRUD Factory --
function createCrudMethods<T>(basePath: string) {
  return {
    getAll: (params?: Record<string, string>) => {
      const query = params ? `?${new URLSearchParams(params)}` : "";
      return nextFetch<T[]>(`${basePath}${query}`);
    },
    getById: (id: string) => nextFetch<T>(`${basePath}/${id}`),
    create: (data: unknown) =>
      nextFetch<T>(basePath, { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: unknown) =>
      nextFetch<T>(`${basePath}/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) =>
      nextFetch<T>(`${basePath}/${id}`, { method: "DELETE" }),
  };
}

// -- API --
export const api = {
  auth: {
    login: (data: unknown) =>
      nextFetch("/api/auth/login", { method: "POST", body: JSON.stringify(data) }),
    register: (data: unknown) =>
      nextFetch("/api/auth/register", { method: "POST", body: JSON.stringify(data) }),
    logout: () => nextFetch("/api/auth/logout", { method: "GET" }),
  },
  jobs: {
    ...createCrudMethods(`${API_URL}/job`),
    apply: (jobId: string) =>
      nextFetch(`/api/jobs/apply/${jobId}`, { method: "POST" }),
    favorite: (jobId: string) =>
      nextFetch(`/api/jobs/favorite/${jobId}`, { method: "POST" }),
  },
  applications: {
    getAll: () => nextFetch("/api/applications"),
    getById: (id: string) => nextFetch(`/api/applications/${id}`),
    checkApplied: (jobId: string) => nextFetch(`/api/applications/applied/${jobId}`),
  },
  companies: {
    ...createCrudMethods("/api/company"),
  },
};

// -- Session Utility --
export async function verifySession(): Promise<boolean> {
  return refreshToken();
}
