import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { supabaseAdmin }     from "@/lib/supabase";
import { Badge }             from "@/components/ui/badge";
import { InvoiceItemsEditor }   from "./_components/InvoiceItemsEditor";
import { PaymentForm }           from "./_components/PaymentForm";
import { PdfExportButton }       from "./_components/PdfExportButton";
import { DueDateEditor }         from "./_components/DueDateEditor";
import { DeleteInvoiceButton }   from "./_components/DeleteInvoiceButton";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return { title: `請求書 #${id.slice(0, 8).toUpperCase()} | ServiceHub Admin` };
}

const STATUS_CONFIG = {
  UNPAID:  { label: "未払い",   variant: "danger"   as const },
  PARTIAL: { label: "一部入金", variant: "warning"  as const },
  PAID:    { label: "支払済",   variant: "success"  as const },
};

export default async function AdminInvoiceDetailPage({ params }: Props) {
  const { id } = await params;

  const [
    { data: rawInvoice },
    { data: rawItems },
    { data: rawPayments },
  ] = await Promise.all([
    supabaseAdmin
      .from("invoices")
      .select("*, customers(name), orders(work_content)")
      .eq("id", id)
      .single(),
    supabaseAdmin
      .from("invoice_items")
      .select("id, description, quantity, unit_price, amount, tax_rate")
      .eq("invoice_id", id)
      .order("id", { ascending: true }),
    supabaseAdmin
      .from("payments")
      .select("id, amount, paid_at, note")
      .eq("invoice_id", id)
      .order("paid_at", { ascending: false }),
  ]);

  if (!rawInvoice) notFound();

  const invoice = rawInvoice as typeof rawInvoice & {
    customers: { name: string } | null;
    orders:    { work_content: string } | null;
  };

  const items = (rawItems ?? []) as Array<{
    id:          string;
    description: string;
    quantity:    number;
    unit_price:  number;
    amount:      number;
    tax_rate:    number;
  }>;

  const payments = (rawPayments ?? []) as Array<{
    id:      string;
    amount:  number;
    paid_at: string;
    note:    string | null;
  }>;

  const statusCfg = STATUS_CONFIG[invoice.status as keyof typeof STATUS_CONFIG]
    ?? { label: invoice.status, variant: "default" as const };

  const invoiceNo = `#${id.slice(0, 8).toUpperCase()}`;

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <Link
            href="/admin/invoices"
            className="inline-flex items-center gap-1 text-xs text-muted hover:text-foreground transition-colors mb-2"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="m15 18-6-6 6-6" />
            </svg>
            請求一覧に戻る
          </Link>
          <h1 className="text-xl font-bold text-foreground font-mono">
            請求書 {invoiceNo}
          </h1>
          <p className="mt-0.5 text-xs text-muted">
            発行日：{new Date(invoice.issue_date).toLocaleDateString("ja-JP")}
          </p>
        </div>
        <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左: 明細 + 入金履歴 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 請求情報カード */}
          <div className="rounded-lg border border-border bg-surface p-6">
            <h2 className="text-sm font-semibold text-foreground mb-4">請求書情報</h2>
            <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <dt className="text-xs text-muted mb-0.5">請求先</dt>
                <dd className="font-medium text-foreground">{invoice.customers?.name ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted mb-0.5">関連案件</dt>
                <dd className="text-foreground line-clamp-1">{invoice.orders?.work_content ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted mb-0.5">合計金額</dt>
                <dd className="font-bold text-foreground tabular-nums">
                  ¥{invoice.total_amount.toLocaleString("ja-JP")}
                </dd>
              </div>
            </dl>
          </div>

          {/* 請求明細エディタ */}
          <InvoiceItemsEditor invoiceId={id} items={items} />
        </div>

        {/* 右: 操作パネル */}
        <div className="space-y-6">
          {/* PDF 出力 */}
          <div className="rounded-lg border border-border bg-surface p-5">
            <h2 className="text-sm font-semibold text-foreground mb-3">出力</h2>
            <PdfExportButton
              invoice={{
                id,
                issue_date:    invoice.issue_date,
                due_date:      invoice.due_date,
                total_amount:  invoice.total_amount,
                customer_name: invoice.customers?.name ?? "",
                items: items.map((i) => ({
                  description: i.description,
                  quantity:    i.quantity,
                  unit_price:  i.unit_price,
                  amount:      i.amount,
                  tax_rate:    i.tax_rate,
                })),
              }}
            />
          </div>

          {/* 支払期限 */}
          <div className="rounded-lg border border-border bg-surface p-5">
            <DueDateEditor invoiceId={id} dueDate={invoice.due_date} />
          </div>

          {/* 入金 */}
          <PaymentForm
            invoiceId={id}
            payments={payments}
            totalAmount={invoice.total_amount}
          />

          {/* 請求書削除（UNPAID のみ） */}
          {invoice.status === "UNPAID" && (
            <div className="rounded-lg border border-border bg-surface p-5">
              <h2 className="text-sm font-semibold text-foreground mb-3">危険な操作</h2>
              <DeleteInvoiceButton invoiceId={id} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
