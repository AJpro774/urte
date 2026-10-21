"use client";

import { useState } from "react";

export function VoteButtons({
  slug,
  likes,
  dislikes,
}: {
  slug: string;
  likes: number;
  dislikes: number;
}) {
  const [likeCount, setLikes] = useState(likes);
  const [dislikeCount, setDislikes] = useState(dislikes);
  const [msg, setMsg] = useState<string | null>(null);

  async function vote(value: 1 | -1 | 0) {
    setMsg(null);
    const res = await fetch(`/api/v1/studies/${slug}/vote`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ value }),
    });
    if (res.status === 401) {
      setMsg("Sign in to vote.");
      return;
    }
    if (!res.ok) {
      setMsg("Could not record vote.");
      return;
    }
    const data = (await res.json()) as { likeCount: number; dislikeCount: number };
    setLikes(data.likeCount);
    setDislikes(data.dislikeCount);
  }

  return (
    <div style={{ display: "flex", gap: "0.6rem", alignItems: "center", flexWrap: "wrap" }}>
      <button type="button" className="btn btn-ghost" onClick={() => vote(1)}>
        Like · {likeCount}
      </button>
      <button type="button" className="btn btn-ghost" onClick={() => vote(-1)}>
        Dislike · {dislikeCount}
      </button>
      {msg ? <span className="form-error">{msg}</span> : null}
    </div>
  );
}
