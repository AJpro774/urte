import Link from "next/link";
import { AskForm } from "@/components/AskForm";
import { EXAMPLE_ASKS, EXAMPLE_STUDIES } from "@/lib/data/seed-studies";
import { nextFridayPacificDate } from "@/lib/bot/window";

export const metadata = { title: "Ask for a study" };

export default async function AskPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const friday = nextFridayPacificDate();

  return (
    <div className="shell section">
      <h1 style={{ marginTop: 0 }}>Ask for a new study</h1>
      <p style={{ color: "var(--text-muted)", maxWidth: "40rem" }}>
        Verified accounts can submit questions for the weekly Friday research batch. Alexander
        reviews asks before any bot work begins. Quotas: 2/day, 5/week, 3 open.
      </p>
      <p className="pill">Next Friday batch · {friday} PT</p>

      <div style={{ display: "grid", gap: "2rem", marginTop: "1.5rem" }}>
        <AskForm initialQuestion={q ?? ""} />

        <div>
          <h2>Similar published studies</h2>
          <ul>
            {EXAMPLE_STUDIES.slice(0, 3).map((s) => (
              <li key={s.id}>
                <Link href={`/study/${s.slug}`}>{s.title}</Link>
              </li>
            ))}
          </ul>
          <h2>Open asks</h2>
          <ul>
            {EXAMPLE_ASKS.map((a) => (
              <li key={a.id}>
                <Link href={`/ask/${a.id}`}>{a.question}</Link> · {a.voteCount} votes
              </li>
            ))}
          </ul>
          <p>
            <Link href="/asks">See all approved & scheduled asks</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
