import { authFetch } from "@/lib/server-api";

export async function GET({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return authFetch(`/applications/${id}/applicants`, "GET", undefined, {
    requireAuth: true,
  });
}
