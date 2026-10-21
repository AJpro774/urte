import Link from "next/link";
import { notFound } from "next/navigation";
import { KatexBlock } from "@/components/KatexBlock";
import { StudyChart } from "@/components/StudyChart";
import { StudyDiagram } from "@/components/StudyDiagram";
import { getStudyBySlug } from "@/lib/data/seed-studies";
import { VoteButtons } from "@/components/VoteButtons";
import { CommentForm } from "@/components/CommentForm";

export async function generateStaticParams() {
  return [
    { slug: "su-34m-dynamic-pressure-limit" },
    { slug: "submarine-performance-vs-water-temperature" },
    { slug: "delta-v-to-pluto-chemical-vs-ntp-vs-ion" },
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = getStudyBySlug(slug);
  return { title: study?.title ?? "Study" };
}

export default async function StudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = getStudyBySlug(slug);
  if (!study) notFound();

  const posted = new Date(study.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "America/Los_Angeles",
  });

  return (
    <article>
      <header className="shell study-header">
        <div className="meta-row">
          <span className="badge">{study.field}</span>
          <span className="badge badge-origin">
            {study.origin === "human"
              ? "Human-authored"
              : study.origin === "ai_assisted"
                ? "AI-assisted — reviewed"
                : "AI-generated — reviewed by a human"}
          </span>
          {study.isExample ? <span className="badge badge-example">Example data</span> : null}
          <span>v{study.versionNo}</span>
          <span>·</span>
          <span>{study.readingTimeMin} min read</span>
        </div>
        <h1>{study.title}</h1>
        <p style={{ color: "var(--text-muted)", maxWidth: "42rem" }}>{study.question}</p>
        <div className="meta-row">
          <span>Posted {posted} (PT)</span>
          {study.reviewedBy ? (
            <span>
              · Reviewed by {study.reviewedBy}
              {study.reviewedAt
                ? ` on ${new Date(study.reviewedAt).toLocaleDateString("en-US")}`
                : ""}
            </span>
          ) : null}
        </div>
        <div className="meta-row" style={{ marginTop: "0.75rem" }}>
          {study.tags.map((t) => (
            <span key={t} className="chip">
              {t}
            </span>
          ))}
        </div>
      </header>

      <div className="shell study-layout">
        <aside className="toc panel" aria-label="On this page">
          <strong>On this page</strong>
          <a href="#answer">Answer</a>
          <a href="#diagram">Diagram</a>
          <a href="#methodology">Methodology</a>
          <a href="#equations">Equations</a>
          <a href="#results">Results</a>
          <a href="#comparisons">Comparisons</a>
          <a href="#balance">Positives / Negatives</a>
          <a href="#sources">Sources</a>
          <a href="#engagement">Discussion</a>
        </aside>

        <div>
          <section id="answer" className="answer-card panel">
            <div className="badge">TL;DR</div>
            <div className="headline">
              {study.headlineValue} {study.headlineUnit}{" "}
              <span style={{ fontSize: "0.55em", color: "var(--text-muted)" }}>
                {study.uncertainty}
              </span>
            </div>
            <p style={{ marginBottom: 0 }}>{study.content.answerSummary}</p>
            <p style={{ color: "var(--text-muted)", fontSize: "0.92rem" }}>
              Confidence: <strong>{study.confidence}</strong> · Key assumption:{" "}
              {study.keyAssumption}
            </p>
          </section>

          <section id="diagram">
            <StudyDiagram kind={study.content.diagramKind} />
          </section>

          <hr className="divider" />

          <section id="methodology" className="prose-col">
            <h2>Methodology</h2>
            <p>{study.content.methodology.approach}</p>
            <ul>
              <li>
                Software: {study.content.methodology.software}{" "}
                <span className="mono">{study.content.methodology.softwareVersion}</span>
              </li>
              <li>Model: {study.content.methodology.modelType}</li>
              <li>Settings: {study.content.methodology.settings}</li>
              <li>Validation: {study.content.methodology.validation}</li>
            </ul>
            <h3>Assumptions</h3>
            <ol>
              {study.content.assumptions.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ol>
            <h3>Limitations</h3>
            <ol>
              {study.content.limitations.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ol>
          </section>

          <section id="equations" className="prose-col">
            <h2>Equations</h2>
            {study.content.equations.map((eq) => (
              <div key={eq.latex}>
                <KatexBlock latex={eq.latex} />
                <ul>
                  {eq.symbols.map((s) => (
                    <li key={s.symbol}>
                      <span className="mono">{s.symbol}</span> — {s.meaning} (
                      <span className="mono">{s.unit}</span>)
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          <section id="results" className="figure-bleed" style={{ margin: "2rem auto" }}>
            <h2 className="shell" style={{ width: "100%" }}>
              Results
            </h2>
            {study.charts.map((c) => (
              <StudyChart key={c.id} chart={c} />
            ))}
            <div className="panel" style={{ padding: "1rem", marginTop: "1rem", overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-mono)", fontSize: "0.9rem" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", borderBottom: "1px solid var(--border)", padding: "0.4rem" }}>
                      Parameter
                    </th>
                    <th style={{ textAlign: "left", borderBottom: "1px solid var(--border)", padding: "0.4rem" }}>
                      Value
                    </th>
                    <th style={{ textAlign: "left", borderBottom: "1px solid var(--border)", padding: "0.4rem" }}>
                      Source
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {study.content.parameters.map((p) => (
                    <tr key={p.symbol}>
                      <td style={{ padding: "0.4rem" }}>
                        {p.name} ({p.symbol})
                      </td>
                      <td style={{ padding: "0.4rem" }}>
                        {p.value} {p.unit}
                      </td>
                      <td style={{ padding: "0.4rem" }}>{p.source}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section id="comparisons" className="prose-col">
            <h2>Comparisons</h2>
            <div className="panel" style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", padding: "0.75rem", borderBottom: "1px solid var(--border)" }}>
                      Case
                    </th>
                    <th style={{ textAlign: "left", padding: "0.75rem", borderBottom: "1px solid var(--border)" }}>
                      Value
                    </th>
                    <th style={{ textAlign: "left", padding: "0.75rem", borderBottom: "1px solid var(--border)" }}>
                      % diff
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {study.content.comparisons.map((c) => (
                    <tr key={c.label}>
                      <td style={{ padding: "0.75rem", borderBottom: "1px solid var(--border)" }}>
                        {c.label}
                        {c.reference ? (
                          <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                            {c.reference}
                          </div>
                        ) : null}
                      </td>
                      <td className="mono" style={{ padding: "0.75rem", borderBottom: "1px solid var(--border)" }}>
                        {c.value} {c.unit}
                      </td>
                      <td className="mono" style={{ padding: "0.75rem", borderBottom: "1px solid var(--border)" }}>
                        {c.pctDiff != null ? `${c.pctDiff}%` : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section id="balance" className="figure-bleed" style={{ margin: "2rem auto" }}>
            <h2>Positives / Negatives / Neutrals</h2>
            <div className="triad">
              <div className="panel pos">
                <h3>Positives</h3>
                <ul>
                  {study.content.positives.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
              <div className="panel neg">
                <h3>Negatives</h3>
                <ul>
                  {study.content.negatives.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
              <div className="panel neu">
                <h3>Neutrals</h3>
                <ul>
                  {study.content.neutrals.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section id="sources" className="prose-col">
            <h2>Sources & citations</h2>
            <ol>
              {study.citations.map((c) => (
                <li key={c.ordinal} style={{ marginBottom: "0.5rem" }}>
                  <strong>{c.title}</strong>
                  {c.authors ? ` — ${c.authors}` : ""}
                  {c.year ? ` (${c.year})` : ""}{" "}
                  <span className="badge">{c.type}</span>{" "}
                  <span className="badge">{c.reliabilityTier}</span>
                  {c.url ? (
                    <>
                      {" "}
                      <a href={c.url} rel="noopener noreferrer">
                        link
                      </a>
                    </>
                  ) : null}
                </li>
              ))}
            </ol>
            <p style={{ color: "var(--text-muted)" }}>{study.content.conclusion}</p>
            {study.content.disclosure ? (
              <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
                Disclosure: {study.content.disclosure}
              </p>
            ) : null}
          </section>

          <section id="engagement" className="prose-col" style={{ marginBottom: "3rem" }}>
            <h2>Engagement</h2>
            <VoteButtons
              slug={study.slug}
              likes={study.likeCount}
              dislikes={study.dislikeCount}
            />
            <h3>Comments</h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {study.comments.map((c) => (
                <li
                  key={c.id}
                  className="panel"
                  style={{ padding: "0.9rem 1rem", marginBottom: "0.6rem" }}
                >
                  <div className="meta-row">
                    <strong>{c.author}</strong>
                    <span>· {new Date(c.createdAt).toLocaleDateString()}</span>
                    <span>· helpful {c.helpfulCount}</span>
                  </div>
                  <p style={{ margin: "0.4rem 0 0" }}>{c.body}</p>
                </li>
              ))}
            </ul>
            <CommentForm slug={study.slug} />
            <p style={{ marginTop: "1rem" }}>
              <Link href={`/study/${study.slug}/correction`}>Suggest a correction</Link>
              {" · "}
              <Link href="/browse">Related studies</Link>
            </p>
          </section>
        </div>
      </div>
    </article>
  );
}
