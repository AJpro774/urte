import Link from "next/link";
import { FoxLogo } from "@/components/FoxLogo";
import { StudyCard } from "@/components/StudyCard";
import { EXAMPLE_ASKS, EXAMPLE_STUDIES, FIELDS } from "@/lib/data/seed-studies";
import { nextFridayPacificDate } from "@/lib/bot/window";

export default function HomePage() {
  const featured = EXAMPLE_STUDIES.slice(0, 3);
  const recent = [...EXAMPLE_STUDIES].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt),
  );
  const discussed = [...EXAMPLE_STUDIES].sort(
    (a, b) => b.commentCount - a.commentCount,
  );
  const nextFriday = nextFridayPacificDate();
  const scheduled = EXAMPLE_ASKS.filter((a) =>
    ["approved", "scheduled"].includes(a.status),
  ).length;

  return (
    <>
      <section className="shell hero">
        <div className="hero-brand">
          <FoxLogo size={128} animate />
          <h1>URTE</h1>
          <p className="tagline">
            Unified Research Technology Encyclopedia — simulated studies where every
            number traces to a deterministic tool, a citation, or both.
          </p>
          <span className="pill">
            Next Friday batch · {scheduled} approved ask
            {scheduled === 1 ? "" : "s"} · {nextFriday} PT
          </span>
        </div>

        <form className="search-hero" action="/search" method="get" role="search">
          <label htmlFor="q" className="sr-only" style={{ position: "absolute", left: -9999 }}>
            Ask any science question
          </label>
          <input
            id="q"
            name="q"
            placeholder="Ask any science question…"
            autoComplete="off"
          />
          <button className="btn btn-primary" type="submit">
            Search
          </button>
        </form>

        <div className="field-chips">
          {FIELDS.map((f) => (
            <Link key={f.slug} className="chip" href={`/browse?field=${f.slug}`}>
              {f.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="shell section">
        <div className="section-head">
          <div>
            <h2>Featured studies</h2>
            <p>Seeded examples clearly labeled as example data.</p>
          </div>
          <Link href="/browse">Browse all</Link>
        </div>
        <div className="study-grid">
          {featured.map((s) => (
            <StudyCard key={s.id} study={s} />
          ))}
        </div>
      </section>

      <section className="shell section">
        <div className="section-head">
          <div>
            <h2>Recently published</h2>
            <p>Newest reviewed studies first.</p>
          </div>
        </div>
        <div className="study-grid">
          {recent.map((s) => (
            <StudyCard key={s.id} study={s} />
          ))}
        </div>
      </section>

      <section className="shell section">
        <div className="section-head">
          <div>
            <h2>Most-discussed this week</h2>
            <p>Comments are secondary to the science — ranking is not a trust signal.</p>
          </div>
        </div>
        <div className="study-grid">
          {discussed.map((s) => (
            <StudyCard key={`d-${s.id}`} study={s} />
          ))}
        </div>
      </section>
    </>
  );
}
