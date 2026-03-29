import { NextResponse } from "next/server";
import { loginSchema } from "@/lib/schemas";
import { ValidationError } from "@/lib/errors";
import { handleError } from "@/lib/error-handler";
import { API_URL } from "@/lib/constants";

async function authHandler(
  request: Request,
  options: {
    endpoint: string;
    forwardCookies?: boolean;
    schema: "login" | "register";
  },
): Promise<NextResponse> {
  const { endpoint, forwardCookies = false, schema } = options;
  const schemaValidator =
    schema === "login"
      ? loginSchema
      : (await import("@/lib/schemas/register")).registerSchema;

  try {
    const body = await request.json();
    const validation = schemaValidator.safeParse(body);

    if (!validation.success) {
      throw new ValidationError(
        validation.error.flatten().fieldErrors as Record<string, string[]>,
      );
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      credentials: "include",
    });

    const data = await response.json();
    const statusCode = response.status;
    const success = response.ok;

    if (success && data.data) {
      delete data.data.accessToken;
      delete data.data.refreshToken;
    }

    const nextResponse = NextResponse.json(
      { success, statusCode, data: data.data, message: data.message },
      { status: statusCode },
    );

    if (forwardCookies) {
      const setCookies = response.headers.getSetCookie();
      const uniqueCookies = [...new Set(setCookies)];
      uniqueCookies.forEach((cookie) =>
        nextResponse.headers.append("Set-Cookie", cookie),
      );
    }

    return nextResponse;
  } catch (error) {
    return handleError(error);
  }
}

export async function loginHandler(request: Request) {
  return authHandler(request, {
    endpoint: "/user/login",
    forwardCookies: true,
    schema: "login",
  });
}

export async function registerHandler(request: Request) {
  return authHandler(request, {
    endpoint: "/user/register",
    forwardCookies: false,
    schema: "register",
  });
}
