import { FoxLogo } from "@/components/FoxLogo";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="shell section prose-col" style={{ marginInline: "auto" }}>
      <FoxLogo size={88} />
      <h1>About URTE</h1>
      <p>
        URTE (Unified Research Technology Encyclopedia) is a searchable encyclopedia of{" "}
        <em>simulated</em> scientific research studies. Visitors ask science questions and receive
        sourced, reproducible studies with equations, charts, comparisons, and balanced findings.
      </p>
      <h2>How studies are made</h2>
      <p>
        Numbers come from deterministic tools (SymPy, Pint, SciPy, TEOS-10, poliastro, and related
        libraries) running in sandboxed compute — never from free-text language-model invention.
        A weekly Friday bot may draft studies from approved asks; drafts stay{" "}
        <strong>pending review</strong> until Alexander publishes them.
      </p>
      <h2>Labeling</h2>
      <ul>
        <li>Human-authored — reviewed</li>
        <li>AI-assisted — reviewed</li>
        <li>AI-generated — reviewed by a human</li>
      </ul>
      <h2>Corrections</h2>
      <p>
        Corrections create a new immutable version with a changelog. Retracted studies keep a
        tombstone page stating the reason.
      </p>
      <h2>Contact</h2>
      <p>Owner and sole contributor: Alexander Patton.</p>
    </div>
  );
}
