/**
 * Seed helper for Neon. When DATABASE_URL is unset, prints the in-app seed summary.
 *
 * Usage: npm run db:seed
 */
import { CREDITS, EXAMPLE_STUDIES, FIELDS } from "../src/lib/data/seed-studies";

async function main() {
  if (!process.env.DATABASE_URL) {
    console.log("No DATABASE_URL — app uses in-memory example studies.");
    console.log(
      JSON.stringify(
        {
          fields: FIELDS.length,
          studies: EXAMPLE_STUDIES.map((s) => s.slug),
          credits: CREDITS.map((c) => c.personName),
        },
        null,
        2,
      ),
    );
    return;
  }

  console.log(
    "DATABASE_URL detected. Use drizzle push + a future SQL seed migration to load rows.",
  );
  console.log(`Would seed ${EXAMPLE_STUDIES.length} example studies and ${FIELDS.length} fields.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
