import { AuthForm } from "@/components/AuthForm";
import Link from "next/link";

export const metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <div className="shell section">
      <h1 style={{ marginTop: 0 }}>Sign in</h1>
      <p style={{ color: "var(--text-muted)" }}>
        Owner bootstrap (local/demo): set <span className="mono">OWNER_EMAIL</span> /{" "}
        <span className="mono">OWNER_PASSWORD</span>, or use the defaults documented in the README.
      </p>
      <AuthForm mode="login" />
      <p>
        No account? <Link href="/register">Register</Link>
      </p>
    </div>
  );
}
