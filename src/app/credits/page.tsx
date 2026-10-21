import { CREDITS } from "@/lib/data/seed-studies";

export const metadata = { title: "Credits" };

export default function CreditsPage() {
  return (
    <div className="shell section">
      <h1 style={{ marginTop: 0 }}>Credits</h1>
      <p style={{ color: "var(--text-muted)", maxWidth: "36rem" }}>
        URTE is a sole-contributor project. This page will grow as trusted reviewers and data
        acknowledgements are added.
      </p>
      <ul style={{ listStyle: "none", padding: 0, maxWidth: "40rem" }}>
        {CREDITS.map((c) => (
          <li
            key={c.personName}
            className="panel"
            style={{ padding: "1.5rem 1.6rem", marginTop: "1rem" }}
          >
            <h2 style={{ margin: "0 0 0.35rem", fontSize: "1.35rem" }}>{c.personName}</h2>
            <p style={{ margin: 0, color: "var(--primary-strong)", fontFamily: "var(--font-display)" }}>
              {c.role}
            </p>
            <p style={{ margin: "0.75rem 0 0", color: "var(--text-muted)" }}>{c.description}</p>
          </li>
        ))}
      </ul>
      <h2 style={{ marginTop: "2.5rem" }}>Software & data acknowledgements</h2>
      <ul style={{ color: "var(--text-muted)" }}>
        <li>Neon Postgres, Upstash Redis, Vercel</li>
        <li>TEOS-10, poliastro/astropy, SymPy, Pint, SciPy</li>
        <li>KaTeX, Apache ECharts</li>
      </ul>
    </div>
  );
}
