import type { ApiResponse } from "@/types/api";
import { Endpoints } from "./api-endpoints";

let isRefreshing = false;
let refreshQueue: Array<(success: boolean) => void> = [];

async function refreshAccessToken(): Promise<boolean> {
  try {
    const res = await fetch(Endpoints.auth.refresh, {
      method: "POST",
      credentials: "include",
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function clientFetch<T>(
  path: string,
  init: RequestInit & { timeout?: number } = {},
  _retry = true,
): Promise<ApiResponse<T>> {
  const { timeout = 15_000, ...options } = init;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(path, {
      ...options,
      signal: controller.signal,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string>),
      },
    });

    clearTimeout(timeoutId);

    if (res.status === 401 && _retry) {
      if (!isRefreshing) {
        isRefreshing = true;
        const ok = await refreshAccessToken();
        isRefreshing = false;

        if (ok) {
          refreshQueue.forEach((cb) => cb(true));
          refreshQueue = [];

          return clientFetch<T>(path, init, false);
        } else {
          refreshQueue.forEach((cb) => cb(false));
          refreshQueue = [];
        }
      } else {
        return new Promise((resolve, reject) => {
          refreshQueue.push((success: boolean) => {
            if (success) {
              resolve(clientFetch<T>(path, init, false));
            } else {
              reject(new Error("Refresh failed"));
            }
          });
        });
      }
    }

    const data = await res.json();
    return { success: res.ok, statusCode: res.status, ...data };
  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof Error && err.name === "AbortError") {
      return { success: false, statusCode: 408, error: "Request timed out" };
    }
    return { success: false, statusCode: 500, error: "Network error" };
  }
}

const post = (path: string, body?: unknown) =>
  clientFetch(path, {
    method: "POST",
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

function createCrudMethods<T>(basePath: string) {
  return {
    getAll: (params?: Record<string, string>) => {
      const qs = params ? `?${new URLSearchParams(params)}` : "";
      return clientFetch<T[]>(`${basePath}${qs}`);
    },
    getById: (id: string) => clientFetch<T>(`${basePath}/${id}`),
    create: (body: unknown) =>
      clientFetch<T>(basePath, { method: "POST", body: JSON.stringify(body) }),
    update: (id: string, body: unknown) =>
      clientFetch<T>(`${basePath}/${id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      }),
    delete: (id: string) =>
      clientFetch<T>(`${basePath}/${id}`, { method: "DELETE" }),
  };
}

export const api = {
  auth: {
    login: (body: unknown) => post(Endpoints.auth.login, body),
    register: (body: unknown) => post(Endpoints.auth.register, body),
    logout: () => clientFetch(Endpoints.auth.logout),
  },

  jobs: {
    ...createCrudMethods(Endpoints.jobs.base),
    adminList: () => clientFetch(Endpoints.jobs.admin),
    getFavorites: () => clientFetch(Endpoints.jobs.favorites),
    favorite: (id: string) => post(Endpoints.jobs.favorite(id)),
    apply: (id: string) => post(Endpoints.applications.apply(id)),
  },

  companies: createCrudMethods(Endpoints.companies.base),

  applications: {
    ...createCrudMethods(Endpoints.applications.base),
    apply: (id: string) => post(Endpoints.applications.apply(id)),
    checkApplied: (jobId: string) =>
      clientFetch(Endpoints.applications.applied(jobId)),
    getApplicants: (jobId: string) =>
      clientFetch(Endpoints.applications.applicants(jobId)),
    updateStatus: (applicationId: string, status: string) =>
      clientFetch(Endpoints.applications.updateStatus(applicationId), {
        method: "PUT",
        body: JSON.stringify({ status: status.toLowerCase() }),
      }),
  },

  user: {
    getById: (id: string) => clientFetch(Endpoints.user.byId(id)),
    getMe: () => clientFetch(Endpoints.user.me),
    update: (id: string, body: unknown) =>
      clientFetch(Endpoints.user.update, {
        method: "PUT",
        body: JSON.stringify(body),
      }),
  },
};

export async function verifySession(): Promise<boolean> {
  return refreshAccessToken();
}
