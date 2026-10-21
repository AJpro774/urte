import { NextResponse } from "next/server";
import { authenticate, createSession } from "@/lib/auth/session";
import { problem } from "@/lib/api/problem";
import { LIMITS, rateLimit } from "@/lib/security/rate-limit";
import { loginSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const rl = await rateLimit({ key: `login:${ip}`, ...LIMITS.loginIp, name: "login" });
  if (!rl.success) return problem(429, "Too many requests");

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return problem(400, "Invalid JSON");
  }
  const parsed = loginSchema.safeParse(json);
  if (!parsed.success) return problem(400, "Invalid credentials");

  const accountRl = await rateLimit({
    key: `login-acct:${parsed.data.email.toLowerCase()}`,
    ...LIMITS.loginAccount,
    name: "login-account",
  });
  if (!accountRl.success) return problem(429, "Too many requests");

  const user = await authenticate(parsed.data.email, parsed.data.password);
  if (!user) return problem(401, "Invalid credentials");

  await createSession(user);
  return NextResponse.json({
    ok: true,
    user: { handle: user.handle, role: user.role },
  });
}
