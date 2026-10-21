import { NextResponse } from "next/server";
import { problem } from "@/lib/api/problem";
import { isBotWindowOpen, verifyBotKey } from "@/lib/bot/window";
import { EXAMPLE_ASKS } from "@/lib/data/seed-studies";
import { LIMITS, rateLimit } from "@/lib/security/rate-limit";

export async function GET(request: Request) {
  const key = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? null;
  if (!verifyBotKey(key)) return problem(401, "Invalid bot key");
  if (!isBotWindowOpen()) return problem(403, "Bot window closed", "Friday 00:00–Saturday 12:00 PT only");

  const rl = await rateLimit({ key: `bot:${key?.slice(0, 8)}`, ...LIMITS.bot, name: "bot" });
  if (!rl.success) return problem(429, "Rate limited");

  const items = EXAMPLE_ASKS.filter((a) => ["approved", "scheduled"].includes(a.status)).map(
    (a, i) => ({
      batchItemId: `batch-item-${i + 1}`,
      askId: a.id,
      question: a.question,
      scopeNotes: a.scopeNotes ?? null,
      field: a.field,
      // Never include asker identity
    }),
  );

  return NextResponse.json({
    friday: items[0]?.askId ? aFriday() : null,
    status: "frozen",
    items,
  });
}

function aFriday() {
  return new Date().toISOString().slice(0, 10);
}
