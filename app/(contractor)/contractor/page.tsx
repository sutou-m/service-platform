import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession }    from "@/lib/auth-helpers";
import { supabaseAdmin } from "@/lib/supabase";
import { StatusBadge }   from "@/components/ui/status-badge";
import type { OrderStatus } from "@/components/ui/status-badge";

export const metadata: Metadata = {
  title: "案件一覧 | ServiceHub 業者ポータル",
};

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("ja-JP", {
    year: "numeric", month: "short", day: "numeric",
  });
}

export default async function ContractorDashboardPage() {
  const session = await getSession();
  if (!session) redirect("/contractor/login");

  // user_id から自社の contractor レコードを取得
  const { data: contractor } = await supabaseAdmin
    .from("contractors")
    .select("id, company_name, status")
    .eq("user_id", session.user.id)
    .maybeSingle();

  if (!contractor) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-sm text-muted mb-2">業者アカウントが紐付けられていません。</p>
        <p className="text-xs text-muted">管理者にお問い合わせください。</p>
      </div>
    );
  }

  const { data: rawOrders } = await supabaseAdmin
    .from("orders")
    .select("id, status, work_content, work_address, visit_at, work_at, created_at, customers(name)")
    .eq("contractor_id", contractor.id)
    .order("created_at", { ascending: false });

  const orders = (rawOrders ?? []) as unknown as Array<{
    id:           string;
    status:       string;
    work_content: string;
    work_address: string;
    visit_at:     string | null;
    work_at:      string | null;
    created_at:   string;
    customers:    { name: string } | null;
  }>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">案件一覧</h1>
        <p className="mt-1 text-sm text-muted">{contractor.company_name} · {orders.length} 件</p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-lg border border-border bg-surface py-16 text-center">
          <p className="text-sm text-muted">担当案件はありません</p>
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-surface overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-paper">
                <th className="text-left px-4 py-3 text-xs text-muted font-medium">作業内容</th>
                <th className="text-left px-4 py-3 text-xs text-muted font-medium hidden md:table-cell">顧客</th>
                <th className="text-left px-4 py-3 text-xs text-muted font-medium hidden lg:table-cell">訪問日</th>
                <th className="text-left px-4 py-3 text-xs text-muted font-medium hidden lg:table-cell">作業日</th>
                <th className="text-left px-4 py-3 text-xs text-muted font-medium">ステータス</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-accent/40 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-foreground line-clamp-1">{order.work_content}</p>
                    <p className="text-xs text-muted mt-0.5 line-clamp-1">{order.work_address}</p>
                  </td>
                  <td className="px-4 py-3 text-muted hidden md:table-cell">
                    {order.customers?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-muted hidden lg:table-cell">
                    {formatDate(order.visit_at)}
                  </td>
                  <td className="px-4 py-3 text-muted hidden lg:table-cell">
                    {formatDate(order.work_at)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={order.status as OrderStatus} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
