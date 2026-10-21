import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { problem } from "@/lib/api/problem";
import { getStudyBySlug } from "@/lib/data/seed-studies";
import { memoryVotes } from "@/lib/data/memory-store";
import { LIMITS, rateLimit } from "@/lib/security/rate-limit";
import { voteSchema } from "@/lib/validation/schemas";

export async function PUT(
  request: Request,
  ctx: { params: Promise<{ slug: string }> },
) {
  const user = await getSessionUser();
  if (!user) return problem(401, "Authentication required");
  if (!user.emailVerified) return problem(403, "Email verification required");

  const rl = await rateLimit({ key: `vote:${user.id}`, ...LIMITS.votes, name: "vote" });
  if (!rl.success) return problem(429, "Too many votes");

  const { slug } = await ctx.params;
  const study = getStudyBySlug(slug);
  if (!study) return problem(404, "Study not found");

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return problem(400, "Invalid JSON");
  }
  const parsed = voteSchema.safeParse(json);
  if (!parsed.success) return problem(400, "Validation failed");

  let entry = memoryVotes.get(slug);
  if (!entry) {
    entry = {
      likeCount: study.likeCount,
      dislikeCount: study.dislikeCount,
      byUser: new Map(),
    };
    memoryVotes.set(slug, entry);
  }

  const prev = entry.byUser.get(user.id) ?? 0;
  if (prev === 1) entry.likeCount -= 1;
  if (prev === -1) entry.dislikeCount -= 1;

  if (parsed.data.value === 1) {
    entry.likeCount += 1;
    entry.byUser.set(user.id, 1);
  } else if (parsed.data.value === -1) {
    entry.dislikeCount += 1;
    entry.byUser.set(user.id, -1);
  } else {
    entry.byUser.delete(user.id);
  }

  return NextResponse.json({
    likeCount: entry.likeCount,
    dislikeCount: entry.dislikeCount,
  });
}
