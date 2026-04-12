import { NextRequest } from "next/server";
import { authFetch } from "@/lib/server-api";

export async function GET(req: NextRequest) {
  return authFetch("/applications", "GET", undefined, { requireAuth: true });
}
