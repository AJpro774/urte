import { NextResponse } from "next/server";

export function problem(
  status: number,
  title: string,
  detail?: string,
  extras?: Record<string, unknown>,
) {
  return NextResponse.json(
    {
      type: "about:blank",
      title,
      status,
      detail,
      ...extras,
    },
    {
      status,
      headers: { "content-type": "application/problem+json" },
    },
  );
}
