import { NextRequest } from "next/server";
import { authFetch } from "@/lib/server-api";
import { BackendEndpoints } from "@/lib/api-endpoints";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return authFetch(
    BackendEndpoints.applications.applicants(id),
    "GET",
    undefined,
    {
      requireAuth: true,
    },
  );
}
