import Link from "next/link";
import { StudyCard } from "@/components/StudyCard";
import { searchStudies } from "@/lib/data/seed-studies";

export const metadata = { title: "Search" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const results = searchStudies(q);

  return (
    <div className="shell section">
      <h1 style={{ marginTop: 0 }}>Search</h1>
      <form className="search-hero" action="/search" method="get" style={{ margin: "1rem 0 2rem" }}>
        <input name="q" defaultValue={q} placeholder="Search studies…" />
        <button className="btn btn-primary" type="submit">
          Search
        </button>
      </form>

      {q && results.length === 0 ? (
        <div className="panel" style={{ padding: "1.5rem" }}>
          <h2 style={{ marginTop: 0 }}>No matching study yet</h2>
          <p style={{ color: "var(--text-muted)" }}>
            You can ask for this question to be researched in the next Friday batch, or write the
            study yourself under the contributor regulations.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <Link className="btn btn-primary" href={`/ask?q=${encodeURIComponent(q)}`}>
              Ask for this study
            </Link>
            <Link className="btn btn-ghost" href="/submit">
              Write this study yourself
            </Link>
          </div>
        </div>
      ) : (
        <>
          <p style={{ color: "var(--text-muted)" }}>
            {results.length} result{results.length === 1 ? "" : "s"}
            {q ? ` for “${q}”` : ""}
          </p>
          <div className="study-grid">
            {results.map((s) => (
              <StudyCard key={s.id} study={s} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
