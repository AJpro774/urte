import { EXAMPLE_ASKS } from "@/lib/data/seed-studies";
import { isBotWindowOpen, nextFridayPacificDate } from "@/lib/bot/window";

export const metadata = { title: "Status" };

export default function StatusPage() {
  const friday = nextFridayPacificDate();
  const approved = EXAMPLE_ASKS.filter((a) =>
    ["approved", "scheduled"].includes(a.status),
  ).length;

  return (
    <div className="shell section">
      <h1 style={{ marginTop: 0 }}>Site status</h1>
      <div className="study-grid">
        <div className="panel" style={{ padding: "1.25rem" }}>
          <h2 style={{ marginTop: 0, fontSize: "1.1rem" }}>Health</h2>
          <p className="badge" style={{ color: "var(--success)" }}>
            Operational
          </p>
          <p style={{ color: "var(--text-muted)" }}>Foundation build · seeded example data</p>
        </div>
        <div className="panel" style={{ padding: "1.25rem" }}>
          <h2 style={{ marginTop: 0, fontSize: "1.1rem" }}>Next Friday batch</h2>
          <p className="mono">{friday} PT</p>
          <p>{approved} approved ask(s) in queue (cap 5)</p>
        </div>
        <div className="panel" style={{ padding: "1.25rem" }}>
          <h2 style={{ marginTop: 0, fontSize: "1.1rem" }}>Bot window</h2>
          <p>{isBotWindowOpen() ? "Open (Friday–Sat noon PT)" : "Closed"}</p>
        </div>
      </div>
    </div>
  );
}
