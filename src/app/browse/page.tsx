import { StudyCard } from "@/components/StudyCard";
import { EXAMPLE_STUDIES, FIELDS } from "@/lib/data/seed-studies";
import Link from "next/link";

export const metadata = { title: "Browse" };

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ field?: string; origin?: string; sort?: string }>;
}) {
  const sp = await searchParams;
  let list = EXAMPLE_STUDIES.filter((s) => s.status === "published");
  if (sp.field) list = list.filter((s) => s.fieldSlug === sp.field);
  if (sp.origin) list = list.filter((s) => s.origin === sp.origin);
  if (sp.sort === "liked") list = [...list].sort((a, b) => b.likeCount - a.likeCount);
  else list = [...list].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  return (
    <div className="shell section">
      <div className="section-head">
        <div>
          <h1 style={{ margin: 0, fontSize: "1.8rem" }}>Browse studies</h1>
          <p>Filter by field, origin, and sort. Votes affect popular sort only.</p>
        </div>
      </div>

      <div className="field-chips" style={{ justifyContent: "flex-start", marginBottom: "1.5rem" }}>
        <Link className="chip" href="/browse">
          All
        </Link>
        {FIELDS.map((f) => (
          <Link key={f.slug} className="chip" href={`/browse?field=${f.slug}`}>
            {f.name}
          </Link>
        ))}
        <Link className="chip" href="/browse?sort=liked">
          Most liked
        </Link>
        <Link className="chip" href="/browse?origin=ai_generated">
          AI-generated
        </Link>
        <Link className="chip" href="/browse?origin=human">
          Human-authored
        </Link>
      </div>

      <div className="study-grid">
        {list.map((s) => (
          <StudyCard key={s.id} study={s} />
        ))}
      </div>
    </div>
  );
}
