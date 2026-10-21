import Link from "next/link";
import type { PublicStudy } from "@/lib/data/types";

export function StudyCard({ study }: { study: PublicStudy }) {
  return (
    <Link href={`/study/${study.slug}`} className="study-card anim-rise">
      <div className="meta-row">
        <span className="badge">{study.field}</span>
        <span className="badge badge-origin">{originLabel(study.origin)}</span>
        {study.isExample ? <span className="badge badge-example">Example data</span> : null}
      </div>
      <h3>{study.title}</h3>
      <p className="answer">
        <span className="num">
          {study.headlineValue} {study.headlineUnit}
        </span>{" "}
        {study.uncertainty} — {study.content.answerSummary.slice(0, 110)}…
      </p>
    </Link>
  );
}

function originLabel(o: PublicStudy["origin"]) {
  if (o === "human") return "Human-authored";
  if (o === "ai_assisted") return "AI-assisted";
  return "AI-generated";
}
