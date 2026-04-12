import { authFetch } from "@/lib/server-api";

export async function GET() {
  return authFetch("/job/admin", "GET", undefined, { requireAuth: true });
}
