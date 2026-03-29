import { registerHandler } from "@/lib/auth-handler";

export async function POST(request: Request) {
  return registerHandler(request);
}