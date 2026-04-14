import { NextRequest } from "next/server";
import { authFetch } from "@/lib/server-api";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json();

  return authFetch(`/applications/update-status/${id}`, "PUT", body, {
    requireAuth: true,
  });
}
