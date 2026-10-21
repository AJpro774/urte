import { createHash, randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { problem } from "@/lib/api/problem";
import { isBotWindowOpen, verifyBotKey } from "@/lib/bot/window";
import { memoryDrafts } from "@/lib/data/memory-store";
import { stripBareNumeralsOutsideCitations } from "@/lib/security/sanitize";
import { LIMITS, rateLimit } from "@/lib/security/rate-limit";
import { botDraftSchema } from "@/lib/validation/schemas";

export async function POST(
  request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const key = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? null;
  if (!verifyBotKey(key)) return problem(401, "Invalid bot key");
  if (!isBotWindowOpen()) return problem(403, "Bot window closed");

  const rl = await rateLimit({ key: `bot:${key?.slice(0, 8)}`, ...LIMITS.bot, name: "bot" });
  if (!rl.success) return problem(429, "Rate limited");

  const { id } = await ctx.params;
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return problem(400, "Invalid JSON");
  }

  const parsed = botDraftSchema.safeParse(json);
  if (!parsed.success) {
    return problem(400, "Schema validation failed", parsed.error.issues[0]?.message);
  }

  if (parsed.data.computationRecordIds.length < 1) {
    return problem(400, "Computation records required", "All numbers must reference compute records");
  }

  const lint = stripBareNumeralsOutsideCitations(parsed.data.proseBlocks.join("\n"));
  if (!lint.ok) {
    return problem(
      422,
      "Bare numeral lint failed",
      "Model prose may not include bare numbers; use {{calc:id}} references",
      { violations: lint.violations },
    );
  }

  const draftId = randomUUID();
  memoryDrafts.push({
    id: draftId,
    batchItemId: id,
    title: parsed.data.title,
    status: "pending_review",
    createdAt: new Date().toISOString(),
    payload: parsed.data as unknown as Record<string, unknown>,
  });

  return NextResponse.json(
    {
      id: draftId,
      status: "pending_review",
      contentHash: createHash("sha256")
        .update(JSON.stringify(parsed.data))
        .digest("hex"),
      note: "Draft stored for human review. Bot cannot publish.",
    },
    { status: 201 },
  );
}
