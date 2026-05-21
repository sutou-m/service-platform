import type { Metadata }      from "next";
import Link                    from "next/link";
import { supabaseAdmin }       from "@/lib/supabase";
import { getContractorSession } from "@/lib/contractor-session";
import { StatusBadge }         from "@/components/ui/status-badge";
import type { OrderStatus }    from "@/components/ui/status-badge";
import { StatusFilter }        from "./_components/StatusFilter";

export const metadata: Metadata = {
  title: "案件一覧 | ServiceHub 業者ポータル",
};

type SearchParams = Promise<{ status?: string }>;

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("ja-JP", {
    year: "numeric", month: "short", day: "numeric",
  });
}

export default async function ContractorDashboardPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const contractor           = await getContractorSession();
  const { status: rawStatus } = await searchParams;
  const statusFilter          = rawStatus ?? "";

  let query = supabaseAdmin
    .from("orders")
    .select("id, status, work_content, work_address, visit_at, work_at, customers(name)")
    .eq("contractor_id", contractor.id)
    .order("created_at", { ascending: false });

  if (statusFilter) query = query.eq("status", statusFilter);

  const { data: rawOrders } = await query;

  const orders = (rawOrders ?? []) as unknown as Array<{
    id:           string;
    status:       string;
    work_content: string;
    work_address: string;
    visit_at:     string | null;
    work_at:      string | null;
    customers:    { name: string } | null;
  }>;

  return (
    <div className="space-y-5">
      {/* ヘッダー */}
      <div>
        <h1 className="text-xl font-bold text-foreground">案件一覧</h1>
        <p className="mt-1 text-sm text-muted">
          {contractor.company_name} · {orders.length} 件
          {statusFilter && " (絞り込み中)"}
        </p>
      </div>

      {/* ステータスフィルター */}
      <StatusFilter current={statusFilter} />

      {/* テーブル / 空状態 */}
      {orders.length === 0 ? (
        <div className="rounded-lg border border-border bg-surface py-16 text-center">
          <p className="text-sm text-muted">
            {statusFilter ? "該当する案件がありません" : "担当案件はありません"}
          </p>
        </div>
      ) : (
        <>
          {/* デスクトップ: テーブル */}
          <div className="hidden md:block rounded-lg border border-border bg-surface overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-paper">
                  <th className="text-left px-4 py-3 text-xs text-muted font-medium">作業内容</th>
                  <th className="text-left px-4 py-3 text-xs text-muted font-medium">顧客</th>
                  <th className="text-left px-4 py-3 text-xs text-muted font-medium">訪問日</th>
                  <th className="text-left px-4 py-3 text-xs text-muted font-medium">作業日</th>
                  <th className="text-left px-4 py-3 text-xs text-muted font-medium">ステータス</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-accent/40 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-foreground line-clamp-1">{order.work_content}</p>
                      <p className="text-xs text-muted mt-0.5 line-clamp-1">{order.work_address}</p>
                    </td>
                    <td className="px-4 py-3 text-muted">{order.customers?.name ?? "—"}</td>
                    <td className="px-4 py-3 text-muted">{formatDate(order.visit_at)}</td>
                    <td className="px-4 py-3 text-muted">{formatDate(order.work_at)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={order.status as OrderStatus} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/contractor/orders/${order.id}`}
                        className="text-xs text-muted hover:text-foreground transition-colors"
                      >
                        詳細 →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* モバイル: カードリスト */}
          <div className="md:hidden space-y-2">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/contractor/orders/${order.id}`}
                className="block rounded-lg border border-border bg-surface p-4 hover:bg-accent/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <p className="text-sm font-medium text-foreground line-clamp-2 flex-1">
                    {order.work_content}
                  </p>
                  <StatusBadge status={order.status as OrderStatus} />
                </div>
                <p className="text-xs text-muted line-clamp-1 mb-1">{order.work_address}</p>
                <div className="flex gap-4 text-xs text-muted mt-2">
                  {order.customers && <span>{order.customers.name}</span>}
                  {order.visit_at  && <span>訪問：{formatDate(order.visit_at)}</span>}
                  {order.work_at   && <span>作業：{formatDate(order.work_at)}</span>}
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
