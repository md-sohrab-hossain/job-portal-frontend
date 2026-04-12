import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_URL } from "@/lib/constants";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken");

    if (!refreshToken?.value) {
      return NextResponse.json(
        { success: false, error: "No refresh token" },
        { status: 401 },
      );
    }

    const response = await fetch(`${API_URL}/user/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `refreshToken=${refreshToken.value}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: "Token refresh failed" },
        { status: 401 },
      );
    }

    const nextResponse = NextResponse.json({ success: true }, { status: 200 });

    // Forward new cookies (new accessToken) to the browser
    response.headers.getSetCookie().forEach((cookie) => {
      nextResponse.headers.append("Set-Cookie", cookie);
    });

    return nextResponse;
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal error" },
      { status: 500 },
    );
  }
}
