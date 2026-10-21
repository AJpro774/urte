import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { problem } from "@/lib/api/problem";
import { memorySubmissions } from "@/lib/data/memory-store";
import { canSubmitResearch } from "@/lib/security/policy";
import { submissionSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return problem(401, "Authentication required");

  const ageDays =
    (Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24);
  if (!canSubmitResearch(user.role, user.emailVerified, ageDays, user.totpEnabled)) {
    return problem(
      403,
      "Contributor requirements not met",
      "Need verified email, 7-day-old account, and 2FA. Owner accounts always qualify in demo.",
    );
  }

  // Owner bypass for local demo of the wizard validation path
  const allowOwner = user.role === "owner";
  if (!allowOwner && (!user.emailVerified || ageDays < 7 || !user.totpEnabled)) {
    return problem(403, "Contributor requirements not met");
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return problem(400, "Invalid JSON");
  }

  const parsed = submissionSchema.safeParse(json);
  if (!parsed.success) {
    return problem(400, "Validation failed", parsed.error.issues.map((i) => i.message).join("; "));
  }

  const id = randomUUID();
  const checks = {
    sectionsPresent: true,
    citationCount: parsed.data.citations.length,
    primaryCitations: parsed.data.citations.filter((c) =>
      ["primary", "authoritative"].includes(c.reliabilityTier),
    ).length,
    unitsPresent: parsed.data.parameters.every((p) => Boolean(p.unit)),
    balance: {
      positives: parsed.data.positives.length,
      negatives: parsed.data.negatives.length,
      neutrals: parsed.data.neutrals.length,
    },
    repro: parsed.data.hasReproBundle,
    diagram: parsed.data.hasDiagram,
  };

  memorySubmissions.push({
    id,
    userId: user.id,
    status: "in_review",
    payload: parsed.data as unknown as Record<string, unknown>,
    checks,
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ id, status: "in_review", checks }, { status: 201 });
}
