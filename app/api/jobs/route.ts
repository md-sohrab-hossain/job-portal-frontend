import { NextRequest } from "next/server";
import { authFetch } from "@/lib/server-api";
import { BackendEndpoints } from "@/lib/api-endpoints";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  return authFetch(
    `${BackendEndpoints.jobs.base}${url.search}`,
    "GET",
    undefined,
    { requireAuth: false },
  );
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => undefined);
  return authFetch(BackendEndpoints.jobs.base, "POST", body, {
    requireAuth: true,
  });
}
