import { authFetch } from "@/lib/server-api";

export async function GET() {
  return authFetch("/applications", "GET", undefined, { requireAuth: true });
}
