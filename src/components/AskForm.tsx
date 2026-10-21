"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AskForm({ initialQuestion = "" }: { initialQuestion?: string }) {
  const router = useRouter();
  const [question, setQuestion] = useState(initialQuestion);
  const [scopeNotes, setScopeNotes] = useState("");
  const [fieldSlug, setFieldSlug] = useState("aerospace");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const res = await fetch("/api/v1/asks", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ question, scopeNotes, fieldSlug, acceptTerms }),
    });
    setPending(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError((body as { title?: string; detail?: string }).detail ?? (body as { title?: string }).title ?? "Submission failed");
      return;
    }
    const data = (await res.json()) as { id: string };
    router.push(`/ask/${data.id}`);
  }

  return (
    <form className="form-stack panel" style={{ padding: "1.25rem" }} onSubmit={onSubmit}>
      <label>
        Question
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
          minLength={20}
          maxLength={500}
          placeholder="What should the study answer?"
        />
      </label>
      <label>
        Scope notes (optional)
        <textarea
          value={scopeNotes}
          onChange={(e) => setScopeNotes(e.target.value)}
          maxLength={2000}
          placeholder="Constraints, parameter ranges, what “fast” means…"
        />
      </label>
      <label>
        Field
        <select value={fieldSlug} onChange={(e) => setFieldSlug(e.target.value)}>
          <option value="aerospace">Aerospace</option>
          <option value="marine">Marine</option>
          <option value="energy">Energy</option>
          <option value="astronomy">Astronomy</option>
          <option value="materials">Materials</option>
          <option value="physics">Physics</option>
        </select>
      </label>
      <label style={{ flexDirection: "row", alignItems: "center", gap: "0.5rem" }}>
        <input
          type="checkbox"
          checked={acceptTerms}
          onChange={(e) => setAcceptTerms(e.target.checked)}
          required
        />
        I agree to the content policy and understand asks need human approval.
      </label>
      <button className="btn btn-primary" type="submit" disabled={pending}>
        {pending ? "Submitting…" : "Submit ask"}
      </button>
      {error ? <p className="form-error">{error}</p> : null}
    </form>
  );
}
