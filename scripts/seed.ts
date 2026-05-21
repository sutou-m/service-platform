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

  /* ─── テスト用業者アカウント ─────────────────────── */

  const contractorEmail    = "contractor@servicehub.dev";
  const contractorPassword = await bcrypt.hash("Contractor1234!", 10);

  const { data: existingCtUser } = await supabase
    .from("users")
    .select("id")
    .eq("email", contractorEmail)
    .maybeSingle();

  let contractorUserId: string;
  if (existingCtUser) {
    await supabase.from("users").update({ password: contractorPassword }).eq("email", contractorEmail);
    contractorUserId = existingCtUser.id;
    console.log("✅ Contractor user updated:", contractorEmail);
  } else {
    contractorUserId = randomUUID();
    const { error: ctErr } = await supabase.from("users").insert({
      id:       contractorUserId,
      name:     "テスト業者",
      email:    contractorEmail,
      password: contractorPassword,
      role:     "CONTRACTOR",
    });
    if (ctErr) throw ctErr;
    console.log("✅ Contractor user created:", contractorEmail);
  }

  // 株式会社　サンプル（ACTIVE）に紐付け
  const SAMPLE_CONTRACTOR_ID = "cb91b5a1-e5e6-4f57-a661-4fdaa40f4265";
  const { error: linkErr } = await supabase
    .from("contractors")
    .update({ user_id: contractorUserId })
    .eq("id", SAMPLE_CONTRACTOR_ID)
    .is("user_id", null); // すでに紐付け済みなら上書きしない
  if (linkErr) console.warn("Contractor link:", linkErr.message);
  else console.log("✅ Contractor linked to 株式会社　サンプル");

  // SystemConfig default
  const { error: cfgError } = await supabase
    .from("system_configs")
    .upsert({ key: "admin_notify_email", value: email, updated_at: new Date().toISOString() });
  if (cfgError) console.warn("SystemConfig:", cfgError.message);
  else console.log("✅ SystemConfig defaults");

  console.log("\n🎉 Seed complete!");
  console.log("   Admin email:      ", email);
  console.log("   Admin password:    Admin1234!");
  console.log("   Contractor email: ", contractorEmail);
  console.log("   Contractor pass:   Contractor1234!");
}

main().catch((e) => {
  console.error("❌ Seed failed:", e.message);
  process.exit(1);
});
