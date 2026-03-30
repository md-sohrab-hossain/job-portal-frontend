import { NextResponse } from "next/server";
import { loginSchema } from "@/lib/schemas";
import { registerSchema } from "@/lib/schemas/register";
import { ValidationError } from "@/lib/errors";
import { handleError } from "@/lib/error-handler";
import { API_URL } from "@/lib/constants";

const API_AUTH = `${API_URL}`;

async function authHandler(
  request: Request,
  options: {
    endpoint: string;
    forwardCookies?: boolean;
    schema: typeof loginSchema | typeof registerSchema;
  },
): Promise<NextResponse> {
  const { endpoint, forwardCookies = false, schema } = options;

  try {
    const body = await request.json();
    const validation = schema.safeParse(body);

    if (!validation.success) {
      throw new ValidationError(
        validation.error.flatten().fieldErrors as Record<string, string[]>,
      );
    }

    const response = await fetch(`${API_AUTH}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      credentials: "include",
    });

    const data = await response.json();
    const nextResponse = NextResponse.json(
      {
        success: response.ok,
        statusCode: response.status,
        data: data.data,
        message: data.message,
      },
      { status: response.status },
    );

    if (forwardCookies) {
      response.headers.getSetCookie().forEach((cookie) => {
        nextResponse.headers.append("Set-Cookie", cookie);
      });
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
    schema: loginSchema,
  });
}

export async function registerHandler(request: Request) {
  return authHandler(request, {
    endpoint: "/user/register",
    forwardCookies: true,
    schema: registerSchema,
  });
}
