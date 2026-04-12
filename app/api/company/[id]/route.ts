import { NextRequest } from "next/server";
import { authFetch } from "@/lib/server-api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return authFetch(`/company/${id}`, "GET", undefined, { requireAuth: true });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json().catch(() => undefined);
  return authFetch(`/company/${id}`, "PUT", body, { requireAuth: true });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return authFetch(`/company/${id}`, "DELETE", undefined, {
    requireAuth: true,
  });
}
