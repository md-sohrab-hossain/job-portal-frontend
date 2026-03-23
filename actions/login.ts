"use server";

import { LoginInput, loginSchema } from "@/lib/schemas/login";

export async function login(data: LoginInput) {
  const validation = loginSchema.safeParse(data);

  if (!validation.success) {
    const firstError = validation.error.issues[0];
    return { error: firstError?.message || "Validation failed" };
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/user/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        cache: "no-cache",
      },
    );

    const responseData = await response.json();

    if (!response.ok) {
      return {
        error:
          responseData?.message || responseData?.error || "Login failed",
      };
    }

    return { success: true, result: responseData };
  } catch {
    return { error: "Something went wrong" };
  }
}
