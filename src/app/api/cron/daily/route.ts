import { NextResponse } from "next/server";
import { problem } from "@/lib/api/problem";
import { nextFridayPacificDate } from "@/lib/bot/window";

export async function GET(request: Request) {
  const secret = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    // Allow in development for local smoke tests
    if (process.env.NODE_ENV === "production") {
      return problem(401, "Unauthorized");
    }
  }

  const friday = nextFridayPacificDate();
  // Thursday freeze / Saturday close are timezone-aware in production.
  // Foundation build records the intended actions.
  return NextResponse.json({
    ok: true,
    actions: ["reminders", "housekeeping", "batch-freeze-if-thursday", "batch-close-if-saturday"],
    nextFriday: friday,
    at: new Date().toISOString(),
  });
}
