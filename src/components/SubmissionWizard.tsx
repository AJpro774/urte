"use client";

import { useMemo, useState } from "react";

const STEPS = ["Basics", "Methods", "Results", "Sources", "Review"] as const;

export function SubmissionWizard() {
  const [step, setStep] = useState(0);
  const [msg, setMsg] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    question: "",
    answerSummary: "",
    background: "",
    approach: "",
    software: "",
    softwareVersion: "",
    modelType: "",
    settings: "",
    validation: "",
    assumptions: "1.\n2.\n3.",
    limitations: "1.\n2.\n3.",
    positives: "A\nB",
    negatives: "A\nB",
    neutrals: "A\nB",
    conclusion: "",
    disclosure: "",
    latex: "q = \\tfrac{1}{2}\\rho V^2",
    paramName: "Density",
    paramSymbol: "rho",
    paramValue: "1.225",
    paramUnit: "kg/m^3",
    paramSource: "ISA",
    citationTitles: "Source one\nSource two\nSource three\nSource four\nSource five",
    hasReproBundle: false,
    hasDiagram: false,
    acceptContributorAgreement: false,
  });

  const wordCount = useMemo(
    () => form.answerSummary.trim().split(/\s+/).filter(Boolean).length,
    [form.answerSummary],
  );

  function lines(s: string) {
    return s
      .split("\n")
      .map((x) => x.replace(/^\d+\.\s*/, "").trim())
      .filter(Boolean);
  }

  async function submit() {
    setMsg(null);
    const citations = lines(form.citationTitles).map((title, i) => ({
      title,
      type: i < 3 ? "government" : "web",
      reliabilityTier: i < 3 ? "primary" : "secondary",
      year: 2020 + i,
    }));

    const payload = {
      title: form.title,
      question: form.question,
      answerSummary: form.answerSummary,
      background: form.background,
      methodology: {
        approach: form.approach,
        software: form.software,
        softwareVersion: form.softwareVersion,
        modelType: form.modelType,
        settings: form.settings,
        validation: form.validation,
      },
      assumptions: lines(form.assumptions),
      limitations: lines(form.limitations),
      equations: [
        {
          latex: form.latex,
          symbols: [{ symbol: form.paramSymbol, meaning: form.paramName, unit: form.paramUnit }],
        },
      ],
      parameters: [
        {
          name: form.paramName,
          symbol: form.paramSymbol,
          value: Number(form.paramValue),
          unit: form.paramUnit,
          source: form.paramSource,
        },
      ],
      positives: lines(form.positives),
      negatives: lines(form.negatives),
      neutrals: lines(form.neutrals),
      comparisons: [{ label: "This study", value: 1, unit: "1", pctDiff: 0 }],
      conclusion: form.conclusion,
      citations,
      disclosure: form.disclosure,
      hasReproBundle: form.hasReproBundle ? true : false,
      hasDiagram: form.hasDiagram ? true : false,
      acceptContributorAgreement: form.acceptContributorAgreement ? true : false,
    };

    const res = await fetch("/api/v1/submissions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      setMsg(
        (body as { detail?: string; title?: string }).detail ??
          (body as { title?: string }).title ??
          "Validation failed",
      );
      return;
    }
    setMsg(`Submitted for review · id ${(body as { id: string }).id}`);
  }

  return (
    <div className="panel" style={{ padding: "1.25rem", marginTop: "1rem" }}>
      <div className="meta-row" style={{ marginBottom: "1rem" }}>
        {STEPS.map((s, i) => (
          <button
            key={s}
            type="button"
            className="chip"
            style={{
              borderColor: i === step ? "var(--primary)" : undefined,
              color: i === step ? "var(--text)" : undefined,
            }}
            onClick={() => setStep(i)}
          >
            {i + 1}. {s}
          </button>
        ))}
      </div>

      <div className="form-stack" style={{ maxWidth: "42rem" }}>
        {step === 0 && (
          <>
            <label>
              Title (≤120, neutral)
              <input
                value={form.title}
                maxLength={120}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </label>
            <label>
              Research question
              <textarea
                value={form.question}
                onChange={(e) => setForm({ ...form, question: e.target.value })}
              />
            </label>
            <label>
              Abstract / answer summary (100–250 words · currently {wordCount})
              <textarea
                value={form.answerSummary}
                onChange={(e) => setForm({ ...form, answerSummary: e.target.value })}
              />
            </label>
            <label>
              Background (≥150 words, will need ≥2 citations overall)
              <textarea
                value={form.background}
                onChange={(e) => setForm({ ...form, background: e.target.value })}
              />
            </label>
          </>
        )}

        {step === 1 && (
          <>
            <label>
              Approach
              <textarea value={form.approach} onChange={(e) => setForm({ ...form, approach: e.target.value })} />
            </label>
            <label>
              Software
              <input value={form.software} onChange={(e) => setForm({ ...form, software: e.target.value })} />
            </label>
            <label>
              Software version
              <input value={form.softwareVersion} onChange={(e) => setForm({ ...form, softwareVersion: e.target.value })} />
            </label>
            <label>
              Model type
              <input value={form.modelType} onChange={(e) => setForm({ ...form, modelType: e.target.value })} />
            </label>
            <label>
              Solver / mesh / settings
              <textarea value={form.settings} onChange={(e) => setForm({ ...form, settings: e.target.value })} />
            </label>
            <label>
              Validation approach
              <textarea value={form.validation} onChange={(e) => setForm({ ...form, validation: e.target.value })} />
            </label>
            <label>
              Assumptions (≥3, one per line)
              <textarea value={form.assumptions} onChange={(e) => setForm({ ...form, assumptions: e.target.value })} />
            </label>
            <label>
              Limitations (≥3)
              <textarea value={form.limitations} onChange={(e) => setForm({ ...form, limitations: e.target.value })} />
            </label>
            <label>
              Equation (LaTeX)
              <input value={form.latex} onChange={(e) => setForm({ ...form, latex: e.target.value })} />
            </label>
          </>
        )}

        {step === 2 && (
          <>
            <label>
              Parameter name
              <input value={form.paramName} onChange={(e) => setForm({ ...form, paramName: e.target.value })} />
            </label>
            <label>
              Symbol / value / unit / source
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                <input value={form.paramSymbol} onChange={(e) => setForm({ ...form, paramSymbol: e.target.value })} placeholder="symbol" />
                <input value={form.paramValue} onChange={(e) => setForm({ ...form, paramValue: e.target.value })} placeholder="value" />
                <input value={form.paramUnit} onChange={(e) => setForm({ ...form, paramUnit: e.target.value })} placeholder="unit" />
                <input value={form.paramSource} onChange={(e) => setForm({ ...form, paramSource: e.target.value })} placeholder="source" />
              </div>
            </label>
            <label>
              Positives (≥2)
              <textarea value={form.positives} onChange={(e) => setForm({ ...form, positives: e.target.value })} />
            </label>
            <label>
              Negatives (≥2)
              <textarea value={form.negatives} onChange={(e) => setForm({ ...form, negatives: e.target.value })} />
            </label>
            <label>
              Neutrals (≥2)
              <textarea value={form.neutrals} onChange={(e) => setForm({ ...form, neutrals: e.target.value })} />
            </label>
            <label>
              Conclusion
              <textarea value={form.conclusion} onChange={(e) => setForm({ ...form, conclusion: e.target.value })} />
            </label>
          </>
        )}

        {step === 3 && (
          <>
            <label>
              Citations (≥5 titles, one per line; first 3 treated as primary for this wizard)
              <textarea value={form.citationTitles} onChange={(e) => setForm({ ...form, citationTitles: e.target.value })} />
            </label>
            <label>
              Disclosure (COI / AI tool use)
              <textarea value={form.disclosure} onChange={(e) => setForm({ ...form, disclosure: e.target.value })} />
            </label>
            <label style={{ flexDirection: "row", alignItems: "center", gap: "0.5rem" }}>
              <input type="checkbox" checked={form.hasReproBundle} onChange={(e) => setForm({ ...form, hasReproBundle: e.target.checked })} />
              I will attach a reproducibility bundle (inputs, scripts, outputs, manifest, checksums)
            </label>
            <label style={{ flexDirection: "row", alignItems: "center", gap: "0.5rem" }}>
              <input type="checkbox" checked={form.hasDiagram} onChange={(e) => setForm({ ...form, hasDiagram: e.target.checked })} />
              I will supply an SVG diagram or request owner illustration
            </label>
            <label style={{ flexDirection: "row", alignItems: "center", gap: "0.5rem" }}>
              <input type="checkbox" checked={form.acceptContributorAgreement} onChange={(e) => setForm({ ...form, acceptContributorAgreement: e.target.checked })} />
              I accept the Contributor Agreement
            </label>
          </>
        )}

        {step === 4 && (
          <div>
            <h3>Checklist preview</h3>
            <ul>
              <li>Title length: {form.title.length}/120</li>
              <li>Abstract words: {wordCount} (need 100–250)</li>
              <li>Assumptions: {lines(form.assumptions).length}</li>
              <li>Citations: {lines(form.citationTitles).length}</li>
              <li>Repro bundle: {form.hasReproBundle ? "yes" : "missing"}</li>
              <li>Diagram: {form.hasDiagram ? "yes" : "missing"}</li>
            </ul>
            <button type="button" className="btn btn-primary" onClick={submit}>
              Submit for review
            </button>
          </div>
        )}

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            type="button"
            className="btn btn-ghost"
            disabled={step === 0}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
          >
            Back
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            disabled={step === STEPS.length - 1}
            onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
          >
            Next
          </button>
        </div>
        {msg ? <p className="form-error">{msg}</p> : null}
      </div>
    </div>
  );
}
