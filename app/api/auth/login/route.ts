import { loginHandler } from "@/lib/auth-handler";

export async function POST(request: Request) {
  return loginHandler(request);
}