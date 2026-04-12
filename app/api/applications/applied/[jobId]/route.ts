import { NextRequest, NextResponse } from "next/server";
import { authFetch } from "@/lib/server-api";

export async function GET(req: NextRequest, { params }: { params: Promise<{ jobId: string }> }) {
  try {
    const { jobId } = await params;

    const response = await authFetch("/applications", "GET", undefined, { requireAuth: true });
    
    if (!response.ok) {
      return response;
    }

    const data = await response.json();
    
    const hasApplied = data.success && data.data && 
      Array.isArray(data.data) && 
      data.data.some((app: { jobId: string }) => app.jobId === jobId);
    
    return NextResponse.json(
      { success: true, data: hasApplied },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to check application status" },
      { status: 500 }
    );
  }
}

