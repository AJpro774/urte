import { AuthForm } from "@/components/AuthForm";
import Link from "next/link";

export const metadata = { title: "Register" };

export default function RegisterPage() {
  return (
    <div className="shell section">
      <h1 style={{ marginTop: 0 }}>Create an account</h1>
      <AuthForm mode="register" />
      <p>
        Already registered? <Link href="/login">Sign in</Link>
      </p>
    </div>
  );
}
