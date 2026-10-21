import Link from "next/link";
import { EXAMPLE_ASKS } from "@/lib/data/seed-studies";
import { memoryAsks } from "@/lib/data/memory-store";

export const metadata = { title: "Ask status" };

export default async function AskStatusPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ask =
    EXAMPLE_ASKS.find((a) => a.id === id) ??
    memoryAsks.get(id) ??
    null;

  if (!ask) {
    return (
      <div className="shell section">
        <h1>Ask not found</h1>
        <Link href="/ask">Submit an ask</Link>
      </div>
    );
  }

  return (
    <div className="shell section">
      <p className="badge">{ask.status.replaceAll("_", " ")}</p>
      <h1 style={{ marginTop: "0.5rem" }}>Ask status</h1>
      <p style={{ maxWidth: "40rem" }}>{ask.question}</p>
      {ask.scopeNotes ? (
        <p style={{ color: "var(--text-muted)" }}>Scope: {ask.scopeNotes}</p>
      ) : null}
      {ask.scheduledFriday ? (
        <p className="pill">Approved / estimated Friday {ask.scheduledFriday} PT</p>
      ) : null}

      <h2>Timeline</h2>
      <ol style={{ maxWidth: "36rem" }}>
        {ask.timeline.map((step) => (
          <li key={step.status + step.at} style={{ marginBottom: "0.75rem" }}>
            <strong style={{ fontFamily: "var(--font-display)" }}>
              {step.status.replaceAll("_", " ")}
            </strong>
            <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
              {new Date(step.at).toLocaleString("en-US", { timeZone: "America/Los_Angeles" })} PT
              {step.note ? ` — ${step.note}` : ""}
            </div>
          </li>
        ))}
      </ol>
      <Link href="/asks">Back to open asks</Link>
    </div>
  );
}
