import { authFetch } from "@/lib/server-api";
import { BackendEndpoints } from "@/lib/api-endpoints";

export async function GET() {
  return authFetch(BackendEndpoints.applications.base, "GET", undefined, {
    requireAuth: true,
  });
}
