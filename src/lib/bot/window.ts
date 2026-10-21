/** Friday 00:00 – Saturday 12:00 America/Los_Angeles */

function partsInPacific(date = new Date()): {
  weekday: string;
  hour: number;
  minute: number;
} {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  });
  const map: Record<string, string> = {};
  for (const p of fmt.formatToParts(date)) {
    if (p.type !== "literal") map[p.type] = p.value;
  }
  return {
    weekday: map.weekday ?? "",
    hour: Number(map.hour === "24" ? "0" : map.hour),
    minute: Number(map.minute),
  };
}

export function isBotWindowOpen(now = new Date()): boolean {
  if (process.env.BOT_WINDOW_BYPASS === "true") return true;
  const { weekday, hour, minute } = partsInPacific(now);
  const mins = hour * 60 + minute;
  if (weekday === "Fri") return true;
  if (weekday === "Sat") return mins < 12 * 60;
  return false;
}

export function nextFridayPacificDate(from = new Date()): string {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  });
  const d = new Date(from);
  for (let i = 0; i < 14; i++) {
    const parts = formatter.formatToParts(d);
    const map: Record<string, string> = {};
    for (const p of parts) {
      if (p.type !== "literal") map[p.type] = p.value;
    }
    if (map.weekday === "Fri") {
      return `${map.year}-${map.month}-${map.day}`;
    }
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return d.toISOString().slice(0, 10);
}

export function verifyBotKey(presented: string | null): boolean {
  if (!presented) return false;
  const expected = process.env.BOT_API_KEY;
  if (!expected) {
    // Local/demo: accept a well-known prefix only when explicitly enabled
    return (
      process.env.NODE_ENV !== "production" &&
      presented === "urte_bot_dev_key_do_not_use_in_prod"
    );
  }
  if (presented.length !== expected.length) return false;
  let ok = 0;
  for (let i = 0; i < expected.length; i++) {
    ok |= presented.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return ok === 0;
}
