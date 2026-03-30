import { ApiResponse } from "@/types/api";
import { API_URL } from "./constants";

export async function verifySession(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/user/refresh`, {
      method: "POST",
      credentials: "include",
    });
    return response.ok;
  } catch {
    return false;
  }
}

type FetchOptions = RequestInit & { timeout?: number };

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

async function fetchWithTimeout<T>(
  url: string,
  options: FetchOptions = {},
): Promise<ApiResponse<T>> {
  const { timeout = 10000, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(fetchOptions.headers as Record<string, string>),
      },
    });

    clearTimeout(timeoutId);
    const data = await response.json();

    return {
      success: response.ok,
      statusCode: response.status,
      ...data,
    };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      return { success: false, statusCode: 408, error: "Request timeout" };
    }
    return { success: false, statusCode: 500, error: "Network error" };
  }
}

async function refreshToken(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/user/refresh`, {
      method: "POST",
      credentials: "include",
    });
    return response.ok;
  } catch {
    return false;
  }
}

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

    if (response.status === 401 && retry) {
      if (!isRefreshing) {
        isRefreshing = true;
        const refreshed = await refreshToken();
        isRefreshing = false;

        if (refreshed) {
          onTokenRefreshed("");
          return nextFetch<T>(path, options, false);
        }
      } else {
        return new Promise((resolve) => {
          subscribeTokenRefresh(() => {
            resolve(nextFetch<T>(path, options, false));
          });
        });
      }
    }

    const data = await response.json();

    return {
      success: response.ok,
      statusCode: response.status,
      ...data,
    };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      return { success: false, statusCode: 408, error: "Request timeout" };
    }
    return { success: false, statusCode: 500, error: "Network error" };
  }
}

function createCrudMethods<T>(basePath: string) {
  return {
    getAll: (params?: Record<string, string>) => {
      const query = params ? `?${new URLSearchParams(params)}` : "";
      return fetchWithTimeout<T[]>(`${API_URL}${basePath}${query}`);
    },
    getById: (id: string) => fetchWithTimeout<T>(`${API_URL}${basePath}/${id}`),
    create: (data: unknown) =>
      fetchWithTimeout<T>(`${API_URL}${basePath}`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: unknown) =>
      fetchWithTimeout<T>(`${API_URL}${basePath}/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      fetchWithTimeout<T>(`${API_URL}${basePath}/${id}`, { method: "DELETE" }),
  };
}

export const api = {
  auth: {
    login: (data: unknown) =>
      nextFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    register: (data: unknown) =>
      nextFetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    logout: () => nextFetch("/api/auth/logout", { method: "GET" }),
  },
  jobs: {
    ...createCrudMethods("/job"),
    apply: (jobId: string) =>
      nextFetch(`/api/jobs/apply/${jobId}`, { method: "POST" }),
    favorite: (jobId: string) =>
      nextFetch(`/api/jobs/favorite/${jobId}`, { method: "POST" }),
  },
  applications: {
    getAll: () => nextFetch("/api/applications"),
    getById: (id: string) => nextFetch(`/api/applications/${id}`),
    checkApplied: (jobId: string) =>
      nextFetch(`/api/applications/applied/${jobId}`),
  },
  companies: createCrudMethods("/company"),
};
