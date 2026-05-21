import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { supabaseAdmin }  from "@/lib/supabase";
import { StatusBadge }    from "@/components/ui/status-badge";
import type { OrderStatus } from "@/components/ui/status-badge";
import { StatusChanger }     from "./_components/StatusChanger";
import { AssignContractor }  from "./_components/AssignContractor";
import { OrderFieldsEditor } from "./_components/OrderFieldsEditor";
import { InvoiceButton }     from "./_components/InvoiceButton";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return { title: `案件 #${id.slice(0, 8).toUpperCase()} | ServiceHub Admin` };
}

function Row({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex gap-4 py-3 border-b border-border last:border-0">
      <dt className="w-28 shrink-0 text-xs font-medium text-muted">{label}</dt>
      <dd className="text-sm text-foreground whitespace-pre-wrap">{value}</dd>
    </div>
  );
}

const STATUS_LABEL: Record<string, string> = {
  NEW:              "新規",
  VISIT_SCHEDULING: "訪問調整中",
  WORK_SCHEDULED:   "作業予定",
  WORKING:          "作業中",
  WORK_DONE:        "作業完了",
  INVOICED:         "請求済",
  PAID:             "入金済",
  CLOSED:           "クローズ",
};

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params;

  const [
    { data: order },
    { data: history },
    { data: contractors },
    { data: existingInvoice },
  ] = await Promise.all([
    supabaseAdmin
      .from("orders")
      .select("*, customers(id, name, phone, email), contractors(id, company_name, owner_name)")
      .eq("id", id)
      .single(),
    supabaseAdmin
      .from("order_status_history")
      .select("id, status, changed_at, changed_by")
      .eq("order_id", id)
      .order("changed_at", { ascending: false }),
    supabaseAdmin
      .from("contractors")
      .select("id, company_name")
      .eq("status", "ACTIVE")
      .order("company_name"),
    supabaseAdmin
      .from("invoices")
      .select("id")
      .eq("order_id", id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single(),
  ]);

  if (!order) notFound();

  const o = order as typeof order & {
    customers:   { id: string; name: string; phone: string; email: string } | null;
    contractors: { id: string; company_name: string; owner_name: string } | null;
  };

  const formatDt = (iso: string | null) =>
    iso ? new Date(iso).toLocaleString("ja-JP") : null;

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1 text-xs text-muted hover:text-foreground transition-colors mb-2"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="m15 18-6-6 6-6" />
            </svg>
            案件一覧に戻る
          </Link>
          <h1 className="text-xl font-bold text-foreground font-mono">
            案件 #{id.slice(0, 8).toUpperCase()}
          </h1>
          <p className="mt-0.5 text-xs text-muted">
            作成：{formatDt(o.created_at)}
          </p>
        </div>
        <StatusBadge status={o.status as OrderStatus} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左: 基本情報 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 案件情報 */}
          <div className="rounded-lg border border-border bg-surface p-6">
            <h2 className="text-sm font-semibold text-foreground mb-4">案件情報</h2>
            <dl>
              <Row label="顧客名"     value={o.customers?.name} />
              <Row label="電話番号"   value={o.customers?.phone} />
              <Row label="メール"     value={o.customers?.email} />
              <Row label="担当業者"   value={o.contractors?.company_name} />
              <Row label="作業内容"   value={o.work_content} />
              <Row label="作業場所"   value={o.work_address} />
            </dl>
            <OrderFieldsEditor
              orderId={o.id}
              visitAt={o.visit_at}
              workAt={o.work_at}
              internalMemo={o.internal_memo}
            />
          </div>

          {/* ステータス履歴 */}
          {(history ?? []).length > 0 && (
            <div className="rounded-lg border border-border bg-surface p-6">
              <h2 className="text-sm font-semibold text-foreground mb-4">ステータス履歴</h2>
              <ol className="relative border-l border-border space-y-4 ml-2">
                {(history ?? []).map((h) => (
                  <li key={h.id} className="ml-4">
                    <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-border bg-surface" />
                    <p className="text-sm font-medium text-foreground">
                      {STATUS_LABEL[h.status] ?? h.status}
                    </p>
                    <p className="text-xs text-muted mt-0.5">
                      {new Date(h.changed_at).toLocaleString("ja-JP")}
                      {h.changed_by && ` — ${h.changed_by}`}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        {/* 右: 操作パネル */}
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-surface p-5 space-y-6">
            <StatusChanger
              orderId={o.id}
              currentStatus={o.status}
            />
            <hr className="border-border" />
            <AssignContractor
              orderId={o.id}
              currentContractorId={o.contractor_id}
              contractors={(contractors ?? []) as Array<{ id: string; company_name: string }>}
            />
          </div>

          {/* 請求書 */}
          <div className="rounded-lg border border-border bg-surface p-5">
            <InvoiceButton
              orderId={o.id}
              existingInvoiceId={existingInvoice?.id ?? null}
            />
          </div>

          {/* 問い合わせリンク */}
          {o.inquiry_id && (
            <div className="rounded-lg border border-border bg-surface p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3">紐付き問い合わせ</h3>
              <Link
                href={`/admin/inquiries/${o.inquiry_id}`}
                className="text-sm text-muted hover:text-foreground transition-colors underline-offset-4 hover:underline"
              >
                問い合わせ詳細を見る →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
