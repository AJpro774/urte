import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { problem } from "@/lib/api/problem";
import { adminQueue, memoryAsks, memoryDrafts, memorySubmissions } from "@/lib/data/memory-store";
import { canModerate } from "@/lib/security/policy";

export async function POST(
  _request: Request,
  ctx: { params: Promise<{ kind: string; id: string; action: string }> },
) {
  const user = await getSessionUser();
  if (!user || !canModerate(user.role)) return problem(403, "Forbidden");

  const { kind, id, action } = await ctx.params;

  if (kind === "asks") {
    const ask = memoryAsks.get(id);
    if (ask) {
      ask.status = action === "approve" ? "approved" : "rejected";
      ask.timeline.push({
        status: ask.status,
        at: new Date().toISOString(),
        note: `Admin ${action} by ${user.handle}`,
      });
    }
    const q = adminQueue.asks.find((a) => a.id === id);
    if (q) q.status = action === "approve" ? "approved" : "rejected";
    return NextResponse.json({ ok: true });
  }

  if (kind === "drafts") {
    const draft = memoryDrafts.find((d) => d.id === id);
    if (!draft) return problem(404, "Draft not found");
    if (action === "publish") {
      // Bot cannot publish; only admin can — mark status conceptually
      (draft as { status: string }).status = "published";
    } else {
      (draft as { status: string }).status = "rejected";
    }
    return NextResponse.json({ ok: true, status: draft.status });
  }

  if (kind === "submissions") {
    const sub = memorySubmissions.find((s) => s.id === id);
    if (!sub) return problem(404, "Submission not found");
    sub.status = action === "accept" ? "accepted" : "rejected";
    return NextResponse.json({ ok: true, status: sub.status });
  }

  return problem(404, "Unknown admin resource");
}
