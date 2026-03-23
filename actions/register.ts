"use server";

import { RegisterInput, registerSchema } from "@/lib/schemas/register";

export async function register(data: RegisterInput) {
  const validation = registerSchema.safeParse(data);

  if (!validation.success) {
    const firstError = validation.error.issues[0];
    return { error: firstError?.message || "Validation failed" };
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/user/register`,
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
          responseData?.message || responseData?.error || "Registration failed",
      };
    }

    return { success: true, data: responseData };
  } catch {
    return { error: "Something went wrong" };
  }
}
