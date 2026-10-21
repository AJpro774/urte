import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { canModerate } from "@/lib/security/policy";
import { EXAMPLE_ASKS } from "@/lib/data/seed-studies";
import { adminQueue, memoryDrafts, memorySubmissions } from "@/lib/data/memory-store";
import { AdminActions } from "@/components/AdminActions";

export const metadata = { title: "Admin" };

export default async function AdminPage() {
  const user = await getSessionUser();
  if (!user || !canModerate(user.role)) {
    redirect("/login");
  }

  const asks = [
    ...EXAMPLE_ASKS.map((a) => ({
      id: a.id,
      question: a.question,
      status: a.status,
      createdAt: a.createdAt,
    })),
    ...adminQueue.asks,
  ];

  return (
    <div className="shell section">
      <h1 style={{ marginTop: 0 }}>Admin review queue</h1>
      <p style={{ color: "var(--text-muted)" }}>
        Signed in as {user.displayName} ({user.role}). Ask approval, draft publish, and submission
        review for the foundation build.
      </p>

      <h2>Asks</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {asks.map((a) => (
          <li key={a.id} className="panel" style={{ padding: "1rem", marginBottom: "0.6rem" }}>
            <div className="meta-row">
              <span className="badge">{a.status}</span>
              <span className="mono">{a.id}</span>
            </div>
            <p>{a.question}</p>
            <AdminActions kind="ask" id={a.id} />
          </li>
        ))}
      </ul>

      <h2>AI drafts pending review</h2>
      {memoryDrafts.length === 0 ? (
        <p style={{ color: "var(--text-muted)" }}>No bot drafts uploaded yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {memoryDrafts.map((d) => (
            <li key={d.id} className="panel" style={{ padding: "1rem", marginBottom: "0.6rem" }}>
              <strong>{d.title}</strong>
              <div className="meta-row">
                <span className="badge">{d.status}</span>
                <span>batch item {d.batchItemId}</span>
              </div>
              <AdminActions kind="draft" id={d.id} />
            </li>
          ))}
        </ul>
      )}

      <h2>User submissions</h2>
      {memorySubmissions.length === 0 ? (
        <p style={{ color: "var(--text-muted)" }}>No submissions in queue.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {memorySubmissions.map((s) => (
            <li key={s.id} className="panel" style={{ padding: "1rem", marginBottom: "0.6rem" }}>
              <div className="meta-row">
                <span className="badge">{s.status}</span>
                <span className="mono">{s.id}</span>
              </div>
              <AdminActions kind="submission" id={s.id} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
