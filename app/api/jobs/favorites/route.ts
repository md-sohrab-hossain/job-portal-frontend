import { BackendEndpoints } from "@/lib/api-endpoints";
import { authFetch } from "@/lib/server-api";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  return authFetch(BackendEndpoints.jobs.favorites, "GET", undefined, {
    requireAuth: true,
  });
}
