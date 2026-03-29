import { ApiResponse } from "@/types/api";
import { API_URL } from "./constants";

type FetchOptions = RequestInit & { timeout?: number };

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

export async function publicFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  return fetchWithTimeout(`${API_URL}${path}`, options);
}

export async function nextFetch<T>(
  path: string,
  options: RequestInit & { timeout?: number } = {},
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
      return publicFetch<T[]>(`${basePath}${query}`);
    },
    getById: (id: string) => publicFetch<T>(`${basePath}/${id}`),
    create: (data: unknown) =>
      publicFetch<T>(basePath, { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: unknown) =>
      publicFetch<T>(`${basePath}/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      publicFetch<T>(`${basePath}/${id}`, { method: "DELETE" }),
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
    checkApplied: (jobId: string) => nextFetch(`/api/applications/applied/${jobId}`),
  },
  companies: createCrudMethods("/company"),
};
