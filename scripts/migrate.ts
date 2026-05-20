import { config } from "dotenv";
config({ path: ".env.local" });
config();

import { readFileSync } from "fs";
import { join } from "path";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const accessToken = process.env.SUPABASE_ACCESS_TOKEN!;
const projectRef = new URL(supabaseUrl).hostname.split(".")[0];

const file = process.argv[2];
if (!file) {
  console.error("Usage: npx tsx scripts/migrate.ts <sql-file>");
  process.exit(1);
}

const sql = readFileSync(join(process.cwd(), file), "utf-8");

async function run() {
  console.log(`🚀 Migrating project: ${projectRef} (${file})`);

  const res = await fetch(
    `https://api.supabase.com/v1/projects/${projectRef}/database/query`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ query: sql }),
    }
  );

  const text = await res.text();
  if (!res.ok) {
    console.error("Migration failed:", res.status, text);
    process.exit(1);
  }
  console.log("✅ Done");
}

run().catch((e) => {
  console.error("Error:", e.message);
  process.exit(1);
});
