import { NextRequest, NextResponse } from "next/server";
import { API_URL } from "@/lib/constants";

export async function GET(req: NextRequest) {
  try {
    const accessToken = req.cookies.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { success: false, statusCode: 401, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const response = await fetch(`${API_URL}/applications`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}
