import { NextRequest } from "next/server";
import { authFetch } from "@/lib/server-api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return authFetch(`/job/${id}`, "GET", undefined, { requireAuth: false });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json().catch(() => undefined);
  return authFetch(`/job/${id}`, "PATCH", body, { requireAuth: true });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return authFetch(`/job/${id}`, "DELETE", undefined, { requireAuth: true });
}
