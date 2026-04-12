import type { ApiResponse } from "@/types/api";

let isRefreshing = false;
let refreshQueue: Array<(success: boolean) => void> = [];

async function refreshAccessToken(): Promise<boolean> {
  try {
    const res = await fetch("/api/auth/refresh", {
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
    login: (body: unknown) => post("/api/auth/login", body),
    register: (body: unknown) => post("/api/auth/register", body),
    logout: () => clientFetch("/api/auth/logout"),
  },

  jobs: {
    ...createCrudMethods("/api/jobs"),
    adminList: () => clientFetch("/api/jobs/admin"),
    apply: (id: string) => post(`/api/jobs/apply/${id}`),
    favorite: (id: string) => post(`/api/jobs/favorite/${id}`),
  },

  companies: createCrudMethods("/api/company"),

  applications: {
    ...createCrudMethods("/api/applications"),
    checkApplied: (jobId: string) =>
      clientFetch(`/api/applications/applied/${jobId}`),
  },
};

export async function verifySession(): Promise<boolean> {
  return refreshAccessToken();
}
