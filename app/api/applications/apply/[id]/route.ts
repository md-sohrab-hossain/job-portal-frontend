import { BackendEndpoints } from "@/lib/api-endpoints";
import { authFetch } from "@/lib/server-api";
import { NextRequest } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: jobId } = await params;
  return authFetch(BackendEndpoints.applications.apply(jobId), "POST", undefined, {
    requireAuth: true,
  });
}
