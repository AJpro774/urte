import Link from "next/link";
import { EXAMPLE_ASKS } from "@/lib/data/seed-studies";
import { memoryAsks } from "@/lib/data/memory-store";

export const metadata = { title: "Open asks" };

export default function AsksPage() {
  const asks = [
    ...EXAMPLE_ASKS,
    ...Array.from(memoryAsks.values()),
  ].filter((a) => ["approved", "scheduled", "submitted", "under_review"].includes(a.status));

  return (
    <div className="shell section">
      <h1 style={{ marginTop: 0 }}>Approved & scheduled asks</h1>
      <p style={{ color: "var(--text-muted)" }}>
        Questions only — asker identities are never shown publicly. Votes inform the queue; they
        never auto-approve.
      </p>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {asks.map((a) => (
          <li key={a.id} className="panel" style={{ padding: "1rem 1.2rem", marginBottom: "0.75rem" }}>
            <Link href={`/ask/${a.id}`} style={{ textDecoration: "none", color: "inherit" }}>
              <div className="meta-row">
                <span className="badge">{a.field}</span>
                <span className="badge">{a.status}</span>
                <span>{a.voteCount} votes</span>
              </div>
              <p style={{ margin: "0.5rem 0 0", fontFamily: "var(--font-display)" }}>{a.question}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
