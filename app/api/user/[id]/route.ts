import { BackendEndpoints } from "@/lib/api-endpoints";
import { authFetch } from "@/lib/server-api";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return authFetch(BackendEndpoints.user.byId(id), "GET", undefined, {
    requireAuth: true,
  });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  return authFetch(BackendEndpoints.user.update, "PUT", body, {
    requireAuth: true,
  });
}
