import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { problem } from "@/lib/api/problem";
import { nextFridayPacificDate } from "@/lib/bot/window";
import { adminQueue, memoryAsks } from "@/lib/data/memory-store";
import { canSubmitAsk } from "@/lib/security/policy";
import { LIMITS, rateLimit } from "@/lib/security/rate-limit";
import { askSchema } from "@/lib/validation/schemas";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const asks = Array.from(memoryAsks.values()).filter((a) =>
    status ? a.status === status : ["approved", "scheduled"].includes(a.status),
  );
  return NextResponse.json({ items: asks });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return problem(401, "Authentication required");
  if (!canSubmitAsk(user.role, user.emailVerified)) {
    return problem(403, "Verified account required to submit asks");
  }

  const rl = await rateLimit({
    key: `ask:${user.id}`,
    ...LIMITS.askSubmit,
    name: "ask",
  });
  if (!rl.success) return problem(429, "Daily ask quota exceeded");

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return problem(400, "Invalid JSON");
  }
  const parsed = askSchema.safeParse(json);
  if (!parsed.success) {
    return problem(400, "Validation failed", parsed.error.issues[0]?.message);
  }

  const id = randomUUID();
  const now = new Date().toISOString();
  const ask = {
    id,
    question: parsed.data.question,
    scopeNotes: parsed.data.scopeNotes,
    field: parsed.data.fieldSlug,
    status: "submitted",
    voteCount: 0,
    createdAt: now,
    scheduledFriday: nextFridayPacificDate(),
    timeline: [{ status: "submitted", at: now }],
  };
  memoryAsks.set(id, ask);
  adminQueue.asks.push({
    id,
    question: ask.question,
    status: ask.status,
    createdAt: now,
  });

  return NextResponse.json({ id, status: ask.status }, { status: 201 });
}
