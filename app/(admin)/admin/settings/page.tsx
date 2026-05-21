import type { Metadata }   from "next";
import Link                  from "next/link";
import { supabaseAdmin }     from "@/lib/supabase";
import { getSession }        from "@/lib/auth-helpers";
import { redirect }          from "next/navigation";
import { AdminAccountsPanel } from "./_components/AdminAccountsPanel";
import { NotifySettingsPanel } from "./_components/NotifySettingsPanel";
import { ServiceTypesPanel }  from "./_components/ServiceTypesPanel";

export const metadata: Metadata = {
  title: "設定 | ServiceHub Admin",
};

type SearchParams = Promise<{ tab?: string }>;

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const { tab } = await searchParams;
  const activeTab = tab === "notify" ? "notify" : tab === "services" ? "services" : "accounts";

  /* ── データ取得 ── */
  const [usersRes, configsRes] = await Promise.all([
    supabaseAdmin
      .from("users")
      .select("id, name, email, role")
      .eq("role", "ADMIN")
      .order("name", { ascending: true }),
    supabaseAdmin
      .from("system_configs")
      .select("key, value")
      .in("key", ["admin_notify_email", "service_types"]),
  ]);

  const users = (usersRes.data ?? []) as Array<{
    id: string; name: string; email: string; role: string;
  }>;

  const configs = (configsRes.data ?? []) as Array<{ key: string; value: string }>;
  const notifyEmail  = configs.find((c) => c.key === "admin_notify_email")?.value ?? "";
  const serviceTypes: string[] = (() => {
    const raw = configs.find((c) => c.key === "service_types")?.value;
    if (!raw) return [];
    try { return JSON.parse(raw) as string[]; } catch { return []; }
  })();

  const tabs = [
    { label: "管理者アカウント", value: "accounts"  },
    { label: "メール通知設定",   value: "notify"    },
    { label: "サービス種別",     value: "services"  },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">設定</h1>
        <p className="mt-1 text-sm text-muted">システム設定を管理します</p>
      </div>

      {/* タブナビゲーション */}
      <div className="flex gap-1 border-b border-border">
        {tabs.map((t) => {
          const active = activeTab === t.value;
          return (
            <Link
              key={t.value}
              href={`/admin/settings?tab=${t.value}`}
              style={{
                display:        "inline-flex",
                alignItems:     "center",
                height:         "36px",
                padding:        "0 14px",
                fontSize:       "13px",
                fontWeight:     active ? 600 : 400,
                color:          active ? "#1a1a1a" : "#888",
                borderBottom:   active ? "2px solid #1a1a1a" : "2px solid transparent",
                textDecoration: "none",
                marginBottom:   "-1px",
              }}
            >
              {t.label}
            </Link>
          );
        })}
      </div>

      {/* パネル */}
      {activeTab === "accounts" && (
        <AdminAccountsPanel users={users} currentUserId={session.user.id} />
      )}
      {activeTab === "notify" && (
        <NotifySettingsPanel currentEmail={notifyEmail} />
      )}
      {activeTab === "services" && (
        <ServiceTypesPanel initialTypes={serviceTypes} />
      )}
    </div>
  );
}
