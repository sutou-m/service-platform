import { config } from "dotenv";
config({ path: ".env.local" });
config();

import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function main() {
  console.log("🌱 Seeding...");

  const email = "admin@servicehub.dev";
  const password = await bcrypt.hash("Admin1234!", 10);

  // Upsert admin user
  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .single();

  if (existing) {
    const { error } = await supabase
      .from("users")
      .update({ password })
      .eq("email", email);
    if (error) throw error;
    console.log("✅ Admin user updated:", email);
  } else {
    const { error } = await supabase.from("users").insert({
      id: randomUUID(),
      name: "管理者",
      email,
      password,
      role: "ADMIN",
    });
    if (error) throw error;
    console.log("✅ Admin user created:", email);
  }

  // SystemConfig default
  const { error: cfgError } = await supabase
    .from("system_configs")
    .upsert({ key: "admin_notify_email", value: email, updated_at: new Date().toISOString() });
  if (cfgError) console.warn("SystemConfig:", cfgError.message);
  else console.log("✅ SystemConfig defaults");

  console.log("\n🎉 Seed complete!");
  console.log("   Email:    ", email);
  console.log("   Password:  Admin1234!");
}

main().catch((e) => {
  console.error("❌ Seed failed:", e.message);
  process.exit(1);
});
