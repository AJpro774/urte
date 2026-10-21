"use client";

import { useState } from "react";

export function CommentForm({ slug }: { slug: string }) {
  const [body, setBody] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const res = await fetch(`/api/v1/studies/${slug}/comments`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ body }),
    });
    if (res.status === 401) {
      setMsg("Sign in and verify email to comment.");
      return;
    }
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setMsg((err as { title?: string }).title ?? "Could not post comment.");
      return;
    }
    setBody("");
    setMsg("Comment submitted (held for moderation in this foundation build).");
  }

  return (
    <form className="form-stack" onSubmit={onSubmit}>
      <label>
        Add a comment
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          maxLength={4000}
          required
        />
      </label>
      <button className="btn btn-primary" type="submit">
        Post comment
      </button>
      {msg ? <p className="form-error">{msg}</p> : null}
    </form>
  );
}
