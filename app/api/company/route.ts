import { NextRequest } from "next/server";
import { authFetch } from "@/lib/server-api";
import { BackendEndpoints } from "@/lib/api-endpoints";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  return authFetch(
    `${BackendEndpoints.companies.base}${url.search}`,
    "GET",
    undefined,
    { requireAuth: true },
  );
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return authFetch(
    `${BackendEndpoints.companies.base}/register`,
    "POST",
    body,
    { requireAuth: true },
  );
}
