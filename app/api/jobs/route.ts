import { NextRequest } from "next/server";
import { authFetch } from "@/lib/server-api";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  return authFetch(`/job${url.search}`, "GET", undefined, { requireAuth: false });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => undefined);
  return authFetch("/job", "POST", body, { requireAuth: true });
}
