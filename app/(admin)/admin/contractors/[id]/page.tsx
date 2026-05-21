import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { supabaseAdmin }        from "@/lib/supabase";
import { StatusBadge }          from "@/components/ui/status-badge";
import type { OrderStatus }     from "@/components/ui/status-badge";
import { CreditLimitEditor }      from "./_components/CreditLimitEditor";
import { ContractorStatusChanger } from "./_components/ContractorStatusChanger";
import { ContractorInfoEditor }    from "./_components/ContractorInfoEditor";
import { ContractorLoginPanel }    from "./_components/ContractorLoginPanel";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { data } = await supabaseAdmin
    .from("contractors")
    .select("company_name")
    .eq("id", id)
    .single();
  return { title: data ? `${data.company_name} | 業者詳細` : "業者詳細" };
}


export default async function AdminContractorDetailPage({ params }: Props) {
  const { id } = await params;

  const [{ data: contractor }, { data: rawOrders }] = await Promise.all([
    supabaseAdmin
      .from("contractors")
      .select("*")
      .eq("id", id)
      .single(),
    supabaseAdmin
      .from("orders")
      .select("id, status, work_content, work_at, created_at, customers(name)")
      .eq("contractor_id", id)
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  if (!contractor) notFound();

  const orders = (rawOrders ?? []) as unknown as Array<{
    id:           string;
    status:       string;
    work_content: string;
    work_at:      string | null;
    created_at:   string;
    customers:    { name: string } | null;
  }>;

  // リンク済みユーザー取得
  const linkedUser = contractor.user_id
    ? await supabaseAdmin
        .from("users")
        .select("id, email")
        .eq("id", contractor.user_id)
        .maybeSingle()
        .then(({ data }) => data as { id: string; email: string } | null)
    : null;

  const areas        = (contractor.areas        as string[]) ?? [];
  const serviceTypes = (contractor.service_types as string[]) ?? [];

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <Link
            href="/admin/contractors"
            className="inline-flex items-center gap-1 text-xs text-muted hover:text-foreground transition-colors mb-2"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="m15 18-6-6 6-6" />
            </svg>
            業者一覧に戻る
          </Link>
          <h1 className="text-xl font-bold text-foreground">{contractor.company_name}</h1>
          <p className="mt-0.5 text-xs text-muted">
            登録：{new Date(contractor.created_at).toLocaleDateString("ja-JP")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左: 詳細情報 + 案件一覧 */}
        <div className="lg:col-span-2 space-y-6">
          <ContractorInfoEditor
            contractor={{
              id:            contractor.id,
              company_name:  contractor.company_name,
              owner_name:    contractor.owner_name,
              address:       contractor.address,
              phone:         contractor.phone,
              email:         contractor.email,
              bio:           contractor.bio,
              areas,
              service_types: serviceTypes,
            }}
          />

          {/* 担当案件一覧 */}
          <div className="rounded-lg border border-border bg-surface p-6">
            <h2 className="text-sm font-semibold text-foreground mb-4">
              担当案件
              <span className="ml-2 text-xs font-normal text-muted">{orders.length} 件</span>
            </h2>
            {orders.length === 0 ? (
              <p className="text-sm text-muted">担当案件はありません</p>
            ) : (
              <div className="divide-y divide-border">
                {orders.map((order) => (
                  <div key={order.id} className="py-3 flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm text-foreground line-clamp-1">{order.work_content}</p>
                      <p className="text-xs text-muted mt-0.5">
                        {order.customers?.name ?? "—"}
                        <span className="mx-1.5">·</span>
                        {new Date(order.created_at).toLocaleDateString("ja-JP")}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <StatusBadge status={order.status as OrderStatus} />
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-xs text-muted hover:text-foreground transition-colors"
                      >
                        詳細 →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 右: ステータス + クレジット + ログインアカウント */}
        <div className="space-y-6">
          <ContractorStatusChanger
            contractorId={contractor.id}
            currentStatus={contractor.status}
          />
          <CreditLimitEditor
            contractorId={contractor.id}
            creditBalance={contractor.credit_balance}
            creditLimit={contractor.credit_limit}
          />
          <ContractorLoginPanel
            contractorId={contractor.id}
            linkedUser={linkedUser}
          />
        </div>
      </div>
    </div>
  );
}
