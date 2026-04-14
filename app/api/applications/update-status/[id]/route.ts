import { NextRequest } from "next/server";
import { authFetch } from "@/lib/server-api";
import { BackendEndpoints } from "@/lib/api-endpoints";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json();

  return authFetch(
    BackendEndpoints.applications.updateStatus(id),
    "PUT",
    body,
    {
      requireAuth: true,
    },
  );
}
