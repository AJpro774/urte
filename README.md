# URTE — Unified Research Technology Encyclopedia

Searchable encyclopedia of **simulated scientific research studies**. Every number traces to a deterministic tool, a citation, or both. AI may draft studies on Fridays; **only a human (Alexander Patton) can publish**.

This repository is the Phase 0–1 foundation: Next.js App Router on **Vercel Hobby**, Neon Postgres schema, Upstash rate limits, themed UI, ask/submit/admin flows, bot draft API, and a read-only MCP server.

> Non-commercial personal project. Stay within Vercel Hobby limits (no ads, paid tiers, or selling through the site).

## Stack

| Layer | Choice |
| --- | --- |
| App | TypeScript, Next.js 15 (App Router), React 19 |
| Hosting | Vercel Hobby |
| Database | Neon Postgres + Drizzle ORM (migrations in `drizzle/`) |
| Cache / limits | Upstash Redis (`@upstash/ratelimit`) with in-memory fallback |
| Auth | Session cookies (HttpOnly, Secure, SameSite=Lax), roles `guest`→`owner` |
| Charts / math | Apache ECharts (SVG), KaTeX |
| MCP | `mcp-handler` v2 at `/api/mcp` |
| CI | GitHub Actions: lint, typecheck, tests, build |

## Quick start

```bash
npm ci --legacy-peer-deps
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Demo owner login** (in-memory until `DATABASE_URL` auth is fully wired):

- Email: `alexander@urte.local` (or `OWNER_EMAIL`)
- Password: `ChangeMe-Owner-2026!` (or `OWNER_PASSWORD`)

The app renders **3 seeded example studies** (clearly labeled) without a database so the foundation is runnable immediately.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Local dev server |
| `npm run build` / `start` | Production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run test` | Vitest |
| `npm run ci` | lint + typecheck + test + build |
| `npm run db:push` | Push Drizzle schema to Neon |
| `npm run db:migrate` | Run SQL migrations |

## Environment variables

See [`.env.example`](./.env.example).

| Variable | Required | Notes |
| --- | --- | --- |
| `AUTH_SECRET` | prod | Session hashing salt |
| `DATABASE_URL` | for Neon | Neon connection string |
| `UPSTASH_REDIS_REST_URL` / `TOKEN` | recommended | Falls back to memory limits |
| `BOT_API_KEY` | prod bot | Write-scoped `bot:drafts` key |
| `CRON_SECRET` | prod | Protects `/api/cron/daily` |
| `NEXT_PUBLIC_SITE_URL` | prod | Canonical URL |
| `BOT_WINDOW_BYPASS` | never in prod | Opens bot window for local tests |

## Vercel Hobby deploy

1. Push this repo to your **personal** GitHub account (Hobby cannot link org repos).
2. Import the project in Vercel → Framework Preset: Next.js.
3. Add Marketplace integrations: **Neon** Postgres, **Upstash** Redis.
4. Set env vars from `.env.example` (Production + Preview as appropriate; never put production bot keys in Preview).
5. Deploy. Configure the single WAF rate-limit rule and optional Firewall rules for `/admin` and `/api/v1/bot` in the Vercel dashboard.
6. Apply schema: from a machine with `DATABASE_URL`, run `npm run db:push` (or run `drizzle/0000_init.sql` in the Neon SQL editor).
7. Cron: `vercel.json` schedules `/api/cron/daily` once per day (Hobby maximum).

## Themes

CSS variables on `:root` / `[data-theme]` / `[data-mode]`:

1. **Fox Daylight** (default) — white / orange / cyan  
2. **Lagoon** — light grey / turquoise / yellow  
3. **Admiralty** — white / navy / gold  

Switcher in the header; preference stored in `localStorage` (profile field reserved for signed-in users). Animations honor `prefers-reduced-motion`.

## Key routes

| Path | Purpose |
| --- | --- |
| `/` | Home / main menu |
| `/browse`, `/search` | Discovery |
| `/study/[slug]` | Study detail (sources, charts, diagrams, P/N/N, votes, comments) |
| `/ask`, `/ask/[id]`, `/asks` | Ask intake + status |
| `/submit` | User research wizard (Section 12 validation) |
| `/credits`, `/about` | Credits (Alexander Patton), methodology |
| `/admin` | Review queues (owner/moderator) |
| `/api/mcp` | Read-only MCP tools |
| `/api/v1/bot/*` | Friday-window draft API |
| `/developers`, `/status` | Docs & health |

## Bot draft contract

- Auth: `Authorization: Bearer <BOT_API_KEY>`
- Window: Friday 00:00 – Saturday 12:00 America/Los_Angeles
- Scope: create drafts in `pending_review` only — **cannot publish**
- Upload lint rejects bare numerals in model prose (use `{{calc:id}}` refs + computation records)

## MCP tools

`search_studies`, `get_study`, `get_study_data`, `get_citations`, `get_computation_records`, `list_fields`, `find_related` — published/reviewed content only.

## Security (foundation)

- Strict CSP via middleware nonce, HSTS, `nosniff`, Referrer-Policy, Permissions-Policy, COOP/CORP
- Zod validation with unknown keys rejected (`.strict()`)
- Markdown/SVG sanitization; parameterized ORM access
- Origin check on cookie-authenticated mutating API routes
- Role policy module (`src/lib/security/policy.ts`)

## Example studies

Seeded and labeled **Example data**:

1. Su-34M-class dynamic pressure envelope (open-literature physics only)
2. Submarine drag vs seawater temperature (TEOS-10)
3. Δv to Pluto — chemical vs NTP vs ion

## License

Content licensing TBD (plan suggests CC BY 4.0 for text). Code: All rights reserved until declared otherwise by Alexander Patton.
