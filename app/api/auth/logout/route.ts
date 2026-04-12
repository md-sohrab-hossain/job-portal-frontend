import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");

    return NextResponse.json({
      success: true,
      statusCode: 200,
      message: "Logged out successfully",
    });
  } catch {
    return NextResponse.json({
      success: false,
      statusCode: 500,
      error: "Logout failed",
    });
  }
}
