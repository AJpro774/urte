import Link from "next/link";

export const metadata = { title: "Suggest a correction" };

export default async function CorrectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <div className="shell section">
      <h1>Suggest a correction</h1>
      <p style={{ color: "var(--text-muted)" }}>
        Corrections are tracked separately from comments so they can become versioned updates.
      </p>
      <form className="form-stack panel" style={{ padding: "1.25rem" }} action={`/study/${slug}`} method="get">
        <label>
          Description
          <textarea name="description" required minLength={20} />
        </label>
        <label>
          Evidence URL (optional)
          <input name="evidence" type="url" />
        </label>
        <button className="btn btn-primary" type="submit">
          Submit correction request
        </button>
      </form>
      <p>
        <Link href={`/study/${slug}`}>Back to study</Link>
      </p>
    </div>
  );
}
