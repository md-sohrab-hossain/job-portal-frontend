import { NextResponse } from "next/server";
import { loginSchema } from "@/lib/schemas";
import { registerSchema } from "@/lib/schemas/register";
import { ValidationError } from "@/lib/errors";
import { handleError } from "@/lib/error-handler";
import { API_URL } from "@/lib/constants";
import { BackendEndpoints } from "@/lib/api-endpoints";

type AuthSchema = typeof loginSchema | typeof registerSchema;

async function authHandler(
  request: Request,
  endpoint: string,
  schema: AuthSchema,
): Promise<NextResponse> {
  try {
    const body = await request.json();
    const validation = schema.safeParse(body);

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
    const nextResponse = NextResponse.json(
      {
        success: response.ok,
        statusCode: response.status,
        data: data.data,
        message: data.message,
      },
      { status: response.status },
    );

    // Always forward auth cookies (accessToken, refreshToken) to the browser
    response.headers.getSetCookie().forEach((cookie) => {
      nextResponse.headers.append("Set-Cookie", cookie);
    });

    return nextResponse;
  } catch (error) {
    return handleError(error);
  }
}

export function loginHandler(request: Request) {
  return authHandler(request, BackendEndpoints.auth.login, loginSchema);
}

export function registerHandler(request: Request) {
  return authHandler(request, BackendEndpoints.auth.register, registerSchema);
}
