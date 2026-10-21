"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [handle, setHandle] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch(`/api/v1/auth/${mode}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(
        mode === "login"
          ? { email, password }
          : { email, password, handle, displayName },
      ),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError((body as { title?: string }).title ?? "Request failed");
      return;
    }
    router.push(mode === "login" ? "/account" : "/login");
    router.refresh();
  }

  return (
    <form className="form-stack panel" style={{ padding: "1.25rem" }} onSubmit={onSubmit}>
      {mode === "register" ? (
        <>
          <label>
            Display name
            <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
          </label>
          <label>
            Handle
            <input
              value={handle}
              onChange={(e) => setHandle(e.target.value.toLowerCase())}
              pattern="[a-z0-9_]+"
              required
            />
          </label>
        </>
      ) : null}
      <label>
        Email
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>
      <label>
        Password {mode === "register" ? "(min 12)" : ""}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={mode === "register" ? 12 : 1}
          required
        />
      </label>
      <button className="btn btn-primary" type="submit">
        {mode === "login" ? "Sign in" : "Register"}
      </button>
      {error ? <p className="form-error">{error}</p> : null}
    </form>
  );
}
