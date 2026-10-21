import { NextResponse } from "next/server";
import { registerUser } from "@/lib/auth/session";
import { problem } from "@/lib/api/problem";
import { LIMITS, rateLimit } from "@/lib/security/rate-limit";
import { registerSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const rl = await rateLimit({
    key: `register:${ip}`,
    ...LIMITS.loginIp,
    name: "register",
  });
  if (!rl.success) return problem(429, "Too many requests");

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return problem(400, "Invalid JSON");
  }

  const parsed = registerSchema.safeParse(json);
  if (!parsed.success) {
    return problem(400, "Validation failed", parsed.error.issues[0]?.message);
  }

  const result = await registerUser(parsed.data);
  if (!result.ok) return problem(400, result.error);

  return NextResponse.json({ ok: true, user: { handle: result.user.handle } }, { status: 201 });
}
