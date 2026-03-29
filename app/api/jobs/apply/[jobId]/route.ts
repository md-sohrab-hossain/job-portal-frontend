import { authFetch } from "@/lib/server-api";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ jobId: string }> },
) {
  const { jobId } = await params;
  return authFetch(`/applications/${jobId}`, "POST", undefined, { requireAuth: true });
}