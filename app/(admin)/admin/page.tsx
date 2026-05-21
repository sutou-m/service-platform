import type { Metadata } from "next";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import { InquiryStatusBadge } from "@/components/ui/status-badge";

export const metadata: Metadata = {
  title: "ダッシュボード | ServiceHub Admin",
};

// ステータス表示設定
const ORDER_STATUS_CONFIG = [
  { key: "NEW",              label: "新規",       color: "#3b82f6" },
  { key: "VISIT_SCHEDULING", label: "訪問調整中", color: "#8b5cf6" },
  { key: "WORK_SCHEDULED",   label: "作業予定",   color: "#6366f1" },
  { key: "WORKING",          label: "作業中",     color: "#f59e0b" },
  { key: "WORK_DONE",        label: "作業完了",   color: "#10b981" },
  { key: "INVOICED",         label: "請求済",     color: "#6b7280" },
  { key: "PAID",             label: "入金済",     color: "#059669" },
] as const;

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface p-5 space-y-1">
      <p className="text-xs font-medium text-muted">{label}</p>
      <p
        className="text-3xl font-bold tabular-nums"
        style={{ color: accent ?? "#1a1a1a" }}
      >
        {value}
      </p>
      {sub && <p className="text-xs text-muted">{sub}</p>}
    </div>
  );
}

export default async function AdminDashboardPage() {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [
    { count: todayInquiryCount },
    { data: allOrders },
    { data: unpaidInvoices },
    { data: recentInquiries },
  ] = await Promise.all([
    supabaseAdmin
      .from("inquiries")
      .select("id", { count: "exact", head: true })
      .gte("created_at", todayStart.toISOString()),
    supabaseAdmin
      .from("orders")
      .select("status"),
    supabaseAdmin
      .from("invoices")
      .select("total_amount, status")
      .neq("status", "PAID"),
    supabaseAdmin
      .from("inquiries")
      .select("id, name, work_content, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  // ステータス別件数を集計
  const statusCount = Object.fromEntries(
    ORDER_STATUS_CONFIG.map((s) => [s.key, 0])
  ) as Record<string, number>;
  for (const o of allOrders ?? []) {
    if (o.status in statusCount) statusCount[o.status]++;
  }

  // 未入金サマリー
  const unpaidList   = (unpaidInvoices ?? []) as Array<{ total_amount: number; status: string }>;
  const unpaidCount  = unpaidList.length;
  const unpaidAmount = unpaidList.reduce((sum, inv) => sum + (inv.total_amount ?? 0), 0);

  const inquiries = (recentInquiries ?? []) as Array<{
    id:           string;
    name:         string;
    work_content: string;
    status:       string;
    created_at:   string;
  }>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold text-foreground">ダッシュボード</h1>
        <p className="mt-0.5 text-sm text-muted">
          {new Date().toLocaleDateString("ja-JP", {
            year: "numeric", month: "long", day: "numeric", weekday: "long",
          })}
        </p>
      </div>

      {/* トップサマリー */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="今日の新規問い合わせ"
          value={todayInquiryCount ?? 0}
          sub="件"
          accent="#3b82f6"
        />
        <StatCard
          label="進行中の案件"
          value={
            (statusCount["NEW"] ?? 0) +
            (statusCount["VISIT_SCHEDULING"] ?? 0) +
            (statusCount["WORK_SCHEDULED"] ?? 0) +
            (statusCount["WORKING"] ?? 0)
          }
          sub="件（進行中）"
        />
        <StatCard
          label="未入金件数"
          value={unpaidCount}
          sub="件"
          accent={unpaidCount > 0 ? "#ef4444" : undefined}
        />
        <StatCard
          label="未入金金額"
          value={`¥${unpaidAmount.toLocaleString("ja-JP")}`}
          accent={unpaidAmount > 0 ? "#ef4444" : undefined}
        />
      </div>

      {/* ステータス別案件数 */}
      <div className="rounded-lg border border-border bg-surface p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-foreground">ステータス別案件数</h2>
          <Link
            href="/admin/orders"
            className="text-xs text-muted hover:text-foreground transition-colors"
          >
            すべての案件 →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {ORDER_STATUS_CONFIG.map(({ key, label, color }) => (
            <Link
              key={key}
              href={`/admin/orders?status=${key}`}
              className="group flex flex-col items-center rounded-lg border border-border p-3 hover:border-current transition-colors text-center"
              style={{ "--hover-color": color } as React.CSSProperties}
            >
              <span
                className="text-2xl font-bold tabular-nums"
                style={{ color }}
              >
                {statusCount[key] ?? 0}
              </span>
              <span className="mt-1 text-xs text-muted group-hover:text-foreground transition-colors">
                {label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* 最近の問い合わせ */}
      <div className="rounded-lg border border-border bg-surface">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">最近の問い合わせ</h2>
          <Link
            href="/admin/inquiries"
            className="text-xs text-muted hover:text-foreground transition-colors"
          >
            すべて見る →
          </Link>
        </div>

        {inquiries.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted">問い合わせはありません</p>
        ) : (
          <ul className="divide-y divide-border">
            {inquiries.map((inq) => (
              <li key={inq.id}>
                <Link
                  href={`/admin/inquiries/${inq.id}`}
                  className="flex items-start justify-between gap-4 px-6 py-4 hover:bg-accent transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">{inq.name} 様</p>
                    <p className="mt-0.5 text-xs text-muted line-clamp-1">{inq.work_content}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="hidden sm:block text-xs text-muted whitespace-nowrap">
                      {new Date(inq.created_at).toLocaleDateString("ja-JP")}
                    </span>
                    <InquiryStatusBadge status={inq.status} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
