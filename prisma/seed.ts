import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg(process.env.DIRECT_URL!);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // ── Admin user ──────────────────────────────────────────────────────────
  const adminEmail = "admin@servicehub.dev";
  const adminPassword = await bcrypt.hash("Admin1234!", 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "管理者",
      email: adminEmail,
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log(`✅ Admin user: ${admin.email}`);

  // ── Sample CMS post ─────────────────────────────────────────────────────
  const samplePost = await prisma.cmsPost.upsert({
    where: { slug: "sample-renovation-tokyo" },
    update: {},
    create: {
      title: "東京都世田谷区 キッチンリフォーム事例",
      slug: "sample-renovation-tokyo",
      description: "老朽化したキッチンを全面リフォーム。使いやすい動線と明るい空間に生まれ変わりました。",
      content: `## 施工概要\n\n築20年のマンションのキッチンを全面リフォームしました。\n\n## 施工内容\n\n- システムキッチン入替え\n- 壁タイル張替え\n- 床材フローリングへ変更\n\n## お客様の声\n\n「毎日の料理が楽しくなりました！」`,
      area: "東京都",
      serviceType: "リフォーム・内装工事",
      completedAt: new Date("2026-04-01"),
      published: true,
    },
  });
  console.log(`✅ Sample CMS post: ${samplePost.slug}`);

  // ── SystemConfig defaults ───────────────────────────────────────────────
  await prisma.systemConfig.upsert({
    where: { key: "admin_notify_email" },
    update: {},
    create: { key: "admin_notify_email", value: adminEmail },
  });
  console.log("✅ SystemConfig defaults");

  console.log("\n🎉 Seeding complete!");
  console.log(`\n📋 Login credentials:`);
  console.log(`   Email:    ${adminEmail}`);
  console.log(`   Password: Admin1234!`);
  console.log(`\n⚠️  Change the admin password after first login.`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
