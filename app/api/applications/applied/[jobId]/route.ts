import { NextRequest, NextResponse } from "next/server";
import { API_URL } from "@/lib/constants";

export async function GET(req: NextRequest, { params }: { params: Promise<{ jobId: string }> }) {
  try {
    const { jobId } = await params;
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
    
    const hasApplied = data.success && data.data && 
      Array.isArray(data.data) && 
      data.data.some((app: { jobId: string }) => app.jobId === jobId);
    
    return NextResponse.json(
      { success: true, data: hasApplied },
      { status: response.status }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to check application status" },
      { status: 500 }
    );
  }
}
