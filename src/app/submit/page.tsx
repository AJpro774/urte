import { SubmissionWizard } from "@/components/SubmissionWizard";

export const metadata = { title: "Submit research" };

export default function SubmitPage() {
  return (
    <div className="shell section">
      <h1 style={{ marginTop: 0 }}>Submit your research</h1>
      <p style={{ color: "var(--text-muted)", maxWidth: "42rem" }}>
        Eligibility: verified email, account ≥ 7 days old, 2FA enabled, Contributor Agreement
        accepted. This wizard enforces the Section 12 minimum-detail rules (word counts, ≥5
        citations with ≥3 primary/authoritative, units on parameters, balance panels, reproducibility
        + diagram acknowledgements).
      </p>
      <SubmissionWizard />
    </div>
  );
}
