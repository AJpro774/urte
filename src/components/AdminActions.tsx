"use client";

import { useState } from "react";

export function AdminActions({
  kind,
  id,
}: {
  kind: "ask" | "draft" | "submission";
  id: string;
}) {
  const [msg, setMsg] = useState<string | null>(null);

  async function act(action: string) {
    setMsg(null);
    const res = await fetch(`/api/v1/admin/${kind}s/${id}/${action}`, {
      method: "POST",
    });
    if (!res.ok) {
      setMsg("Action failed");
      return;
    }
    setMsg(`${action} recorded`);
  }

  return (
    <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", alignItems: "center" }}>
      {kind === "ask" ? (
        <>
          <button type="button" className="btn btn-primary" onClick={() => act("approve")}>
            Approve
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => act("reject")}>
            Reject
          </button>
        </>
      ) : null}
      {kind === "draft" ? (
        <>
          <button type="button" className="btn btn-primary" onClick={() => act("publish")}>
            Publish
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => act("reject")}>
            Reject
          </button>
        </>
      ) : null}
      {kind === "submission" ? (
        <>
          <button type="button" className="btn btn-primary" onClick={() => act("accept")}>
            Accept
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => act("reject")}>
            Reject
          </button>
        </>
      ) : null}
      {msg ? <span style={{ color: "var(--success)", fontSize: "0.9rem" }}>{msg}</span> : null}
    </div>
  );
}
