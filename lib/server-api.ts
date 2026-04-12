import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ApiResponse } from "@/types/api";
import { API_URL } from "@/lib/constants";

export async function authFetch<T = unknown>(
  path: string,
  method: string,
  body?: unknown,
  options?: { requireAuth?: boolean },
): Promise<NextResponse> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken");

  if (options?.requireAuth !== false && !accessToken?.value) {
    return NextResponse.json(
      {
        success: false,
        statusCode: 401,
        error: "Unauthorized",
      } as ApiResponse<T>,
      { status: 401 },
    );
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (accessToken?.value) {
    headers["Authorization"] = `Bearer ${accessToken.value}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  });

  const contentType = response.headers.get("content-type");
  let data: Record<string, unknown> = {};

  if (contentType?.includes("application/json")) {
    data = await response.json();
  } else {
    const text = await response.text();
    data = { message: text || response.statusText };
  }

  const setCookies = response.headers.getSetCookie();
  const uniqueCookies = [...new Set(setCookies)];

  const proxyStatus = response.status === 204 ? 200 : response.status;

  const nextResponse = NextResponse.json(
    {
      success: response.ok,
      statusCode: response.status,
      ...data,
    } as ApiResponse<T>,
    { status: proxyStatus },
  );

  uniqueCookies.forEach((cookie) =>
    nextResponse.headers.append("Set-Cookie", cookie),
  );

  return nextResponse;
}

export async function publicFetch<T>(
  path: string,
  options?: { revalidate?: number },
): Promise<{ data: T | null; error: string | null }> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: options?.revalidate ?? 60 },
    });

    if (!res.ok) {
      return { data: null, error: `Request failed: ${res.status}` };
    }

    const json = await res.json();
    return { data: (json.data ?? json) as T, error: null };
  } catch {
    return { data: null, error: "Network error" };
  }
}
