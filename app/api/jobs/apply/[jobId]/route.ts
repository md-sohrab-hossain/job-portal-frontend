import { NextRequest } from "next/server";
import { BackendEndpoints } from "@/lib/api-endpoints";
import { authFetch } from "@/lib/server-api";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> },
) {
  const { jobId } = await params;
  return authFetch(BackendEndpoints.jobs.apply(jobId), "POST", undefined, {
    requireAuth: true,
  });
}
