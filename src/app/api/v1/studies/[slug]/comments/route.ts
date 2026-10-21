import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { problem } from "@/lib/api/problem";
import { getStudyBySlug } from "@/lib/data/seed-studies";
import { memoryComments } from "@/lib/data/memory-store";
import { LIMITS, rateLimit } from "@/lib/security/rate-limit";
import { sanitizeUserMarkdown } from "@/lib/security/sanitize";
import { commentSchema } from "@/lib/validation/schemas";

export async function GET(
  _request: Request,
  ctx: { params: Promise<{ slug: string }> },
) {
  const { slug } = await ctx.params;
  const study = getStudyBySlug(slug);
  if (!study) return problem(404, "Study not found");
  const extras = memoryComments.filter((c) => c.slug === slug);
  return NextResponse.json({
    items: [
      ...study.comments.map((c) => ({
        id: c.id,
        author: c.author,
        body: c.body,
        createdAt: c.createdAt,
      })),
      ...extras,
    ],
  });
}

export async function POST(
  request: Request,
  ctx: { params: Promise<{ slug: string }> },
) {
  const user = await getSessionUser();
  if (!user) return problem(401, "Authentication required");
  if (!user.emailVerified) return problem(403, "Email verification required");

  const rl = await rateLimit({
    key: `comment:${user.id}`,
    ...LIMITS.comments,
    name: "comment",
  });
  if (!rl.success) return problem(429, "Comment rate limit exceeded");

  const { slug } = await ctx.params;
  if (!getStudyBySlug(slug)) return problem(404, "Study not found");

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return problem(400, "Invalid JSON");
  }
  const parsed = commentSchema.safeParse(json);
  if (!parsed.success) return problem(400, "Validation failed");

  const html = sanitizeUserMarkdown(parsed.data.body);
  const id = randomUUID();
  memoryComments.push({
    id,
    slug,
    author: user.handle,
    body: parsed.data.body,
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ id, status: "held", html }, { status: 201 });
}
