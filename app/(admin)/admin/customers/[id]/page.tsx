import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { supabaseAdmin } from "@/lib/supabase";
import { StatusBadge }   from "@/components/ui/status-badge";
import type { OrderStatus } from "@/components/ui/status-badge";
import { InquiryStatusBadge } from "@/components/ui/status-badge";
import { CustomerMemoForm }   from "./_components/CustomerMemoForm";
import { CustomerInfoEditor } from "./_components/CustomerInfoEditor";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { data } = await supabaseAdmin
    .from("customers")
    .select("name")
    .eq("id", id)
    .single();
  return { title: data ? `${data.name} 様 | 顧客詳細` : "顧客詳細" };
}


const INVOICE_STATUS_LABEL: Record<string, string> = {
  UNPAID:  "未払い",
  PARTIAL: "一部入金",
  PAID:    "支払済",
};

export default async function AdminCustomerDetailPage({ params }: Props) {
  const { id } = await params;

  const [
    { data: customer },
    { data: inquiries },
    { data: rawOrders },
    { data: rawInvoices },
  ] = await Promise.all([
    supabaseAdmin
      .from("customers")
      .select("*")
      .eq("id", id)
      .single(),
    supabaseAdmin
      .from("inquiries")
      .select("id, status, work_content, created_at")
      .eq("customer_id", id)
      .order("created_at", { ascending: false }),
    supabaseAdmin
      .from("orders")
      .select("id, status, work_content, work_at, created_at, contractors(company_name)")
      .eq("customer_id", id)
      .order("created_at", { ascending: false }),
    supabaseAdmin
      .from("invoices")
      .select("id, total_amount, status, issue_date, due_date")
      .eq("customer_id", id)
      .order("issue_date", { ascending: false }),
  ]);

  if (!customer) notFound();

  const orders = (rawOrders ?? []) as unknown as Array<{
    id: string;
    status: string;
    work_content: string;
    work_at: string | null;
    created_at: string;
    contractors: { company_name: string } | null;
  }>;

  const invoices = (rawInvoices ?? []) as Array<{
    id: string;
    total_amount: number;
    status: string;
    issue_date: string;
    due_date: string | null;
  }>;

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <Link
            href="/admin/customers"
            className="inline-flex items-center gap-1 text-xs text-muted hover:text-foreground transition-colors mb-2"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="m15 18-6-6 6-6" />
            </svg>
            顧客一覧に戻る
          </Link>
          <h1 className="text-xl font-bold text-foreground">{customer.name} 様</h1>
          <p className="mt-0.5 text-xs text-muted">
            登録：{new Date(customer.created_at).toLocaleDateString("ja-JP")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左: 基本情報 + 履歴 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 基本情報 */}
          <CustomerInfoEditor
            customer={{
              id:      customer.id,
              name:    customer.name,
              phone:   customer.phone,
              email:   customer.email,
              address: customer.address,
            }}
          />

          {/* 問い合わせ履歴 */}
          <div className="rounded-lg border border-border bg-surface p-6">
            <h2 className="text-sm font-semibold text-foreground mb-4">
              問い合わせ履歴
              <span className="ml-2 text-xs font-normal text-muted">
                {(inquiries ?? []).length} 件
              </span>
            </h2>
            {(inquiries ?? []).length === 0 ? (
              <p className="text-sm text-muted">問い合わせはありません</p>
            ) : (
              <div className="divide-y divide-border">
                {(inquiries ?? []).map((inq) => (
                  <div key={inq.id} className="py-3 flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm text-foreground line-clamp-1">{inq.work_content}</p>
                      <p className="text-xs text-muted mt-0.5">
                        {new Date(inq.created_at).toLocaleDateString("ja-JP")}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <InquiryStatusBadge status={inq.status} />
                      <Link
                        href={`/admin/inquiries/${inq.id}`}
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

          {/* 案件履歴 */}
          <div className="rounded-lg border border-border bg-surface p-6">
            <h2 className="text-sm font-semibold text-foreground mb-4">
              案件履歴
              <span className="ml-2 text-xs font-normal text-muted">
                {orders.length} 件
              </span>
            </h2>
            {orders.length === 0 ? (
              <p className="text-sm text-muted">案件はありません</p>
            ) : (
              <div className="divide-y divide-border">
                {orders.map((order) => (
                  <div key={order.id} className="py-3 flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm text-foreground line-clamp-1">{order.work_content}</p>
                      <p className="text-xs text-muted mt-0.5">
                        {new Date(order.created_at).toLocaleDateString("ja-JP")}
                        {order.contractors?.company_name && (
                          <span className="ml-2">{order.contractors.company_name}</span>
                        )}
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

          {/* 請求履歴 */}
          <div className="rounded-lg border border-border bg-surface p-6">
            <h2 className="text-sm font-semibold text-foreground mb-4">
              請求履歴
              <span className="ml-2 text-xs font-normal text-muted">
                {invoices.length} 件
              </span>
            </h2>
            {invoices.length === 0 ? (
              <p className="text-sm text-muted">請求はありません</p>
            ) : (
              <div className="divide-y divide-border">
                {invoices.map((inv) => (
                  <div key={inv.id} className="py-3 flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        ¥{inv.total_amount.toLocaleString("ja-JP")}
                      </p>
                      <p className="text-xs text-muted mt-0.5">
                        発行：{new Date(inv.issue_date).toLocaleDateString("ja-JP")}
                        {inv.due_date && (
                          <span className="ml-2">
                            期日：{new Date(inv.due_date).toLocaleDateString("ja-JP")}
                          </span>
                        )}
                      </p>
                    </div>
                    <span
                      className="shrink-0 text-xs rounded-full px-2 py-0.5"
                      style={{
                        backgroundColor: inv.status === "PAID" ? "#e6f4ea" : "#fff8e1",
                        color:           inv.status === "PAID" ? "#1e7e34" : "#856404",
                      }}
                    >
                      {INVOICE_STATUS_LABEL[inv.status] ?? inv.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 右: メモ */}
        <div>
          <CustomerMemoForm customerId={customer.id} currentMemo={customer.memo} />
        </div>
      </div>
    </div>
  );
}
