import type { Metadata }       from "next";
import Link                     from "next/link";
import { notFound }             from "next/navigation";
import { supabaseAdmin }        from "@/lib/supabase";
import { getContractorSession } from "@/lib/contractor-session";
import { StatusBadge }          from "@/components/ui/status-badge";
import type { OrderStatus }     from "@/components/ui/status-badge";
import { ReportCardActions }    from "./_components/ReportCardActions";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { data } = await supabaseAdmin
    .from("orders")
    .select("work_content")
    .eq("id", id)
    .single();
  return { title: data ? `${data.work_content} | ServiceHub 業者ポータル` : "案件詳細" };
}

function formatDateTime(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("ja-JP", {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ja-JP", {
    year: "numeric", month: "short", day: "numeric",
  });
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 py-3 border-b border-border last:border-0">
      <dt className="w-32 shrink-0 text-xs text-muted font-medium">{label}</dt>
      <dd className="text-sm text-foreground">{value ?? "—"}</dd>
    </div>
  );
}

export default async function ContractorOrderDetailPage({ params }: Props) {
  const { id }   = await params;
  const contractor = await getContractorSession();

  const [{ data: rawOrder }, { data: rawReports }] = await Promise.all([
    supabaseAdmin
      .from("orders")
      .select("id, status, work_content, work_address, visit_at, work_at, contractor_id, customers(name, phone, email)")
      .eq("id", id)
      .single(),
    supabaseAdmin
      .from("order_reports")
      .select("id, worked_at, content, photo_urls, created_at")
      .eq("order_id", id)
      .eq("contractor_id", contractor.id)
      .order("worked_at", { ascending: false }),
  ]);

  if (!rawOrder) notFound();

  // セキュリティ：自分に割り当てられた案件のみ表示
  if (rawOrder.contractor_id !== contractor.id) notFound();

  type OrderRow = {
    id:            string;
    status:        string;
    work_content:  string;
    work_address:  string;
    visit_at:      string | null;
    work_at:       string | null;
    contractor_id: string | null;
    customers:     { name: string; phone: string; email: string } | null;
  };
  const order = rawOrder as unknown as OrderRow;

  type ReportRow = {
    id:         string;
    worked_at:  string;
    content:    string;
    photo_urls: string[];
    created_at: string;
  };
  const reports = (rawReports ?? []) as unknown as ReportRow[];

  return (
    <div className="space-y-6 max-w-2xl">
      {/* 戻るリンク */}
      <Link
        href="/contractor"
        className="inline-flex items-center gap-1 text-xs text-muted hover:text-foreground transition-colors"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="m15 18-6-6 6-6" />
        </svg>
        案件一覧に戻る
      </Link>

      {/* ヘッダー */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-foreground leading-snug">
            {order.work_content}
          </h1>
        </div>
        <StatusBadge status={order.status as OrderStatus} />
      </div>

      {/* 案件情報 */}
      <div className="rounded-lg border border-border bg-surface p-5">
        <h2 className="text-sm font-semibold text-foreground mb-1">案件情報</h2>
        <dl>
          <InfoRow label="作業内容" value={order.work_content} />
          <InfoRow label="作業場所" value={order.work_address} />
          <InfoRow label="訪問予定日時" value={formatDateTime(order.visit_at)} />
          <InfoRow label="作業予定日時" value={formatDateTime(order.work_at)} />
          <InfoRow label="ステータス"   value={<StatusBadge status={order.status as OrderStatus} />} />
        </dl>
      </div>

      {/* 顧客連絡先 */}
      {order.customers && (
        <div className="rounded-lg border border-border bg-surface p-5">
          <h2 className="text-sm font-semibold text-foreground mb-1">顧客連絡先</h2>
          <dl>
            <InfoRow label="氏名"             value={order.customers.name} />
            <InfoRow label="電話番号"         value={
              <a href={`tel:${order.customers.phone}`} className="text-foreground hover:underline">
                {order.customers.phone}
              </a>
            } />
            <InfoRow label="メールアドレス"   value={
              <a href={`mailto:${order.customers.email}`} className="text-foreground hover:underline">
                {order.customers.email}
              </a>
            } />
          </dl>
        </div>
      )}

      {/* 作業報告登録ボタン */}
      <div>
        <Link
          href={`/contractor/orders/${order.id}/report`}
          style={{
            display:         "inline-flex",
            alignItems:      "center",
            gap:             "6px",
            height:          "44px",
            padding:         "0 20px",
            borderRadius:    "4px",
            fontSize:        "14px",
            fontWeight:      600,
            backgroundColor: "#1a1a1a",
            color:           "#ffffff",
            textDecoration:  "none",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <path d="M12 5v14M5 12h14" />
          </svg>
          作業報告を登録する
        </Link>
      </div>

      {/* 作業報告一覧 */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3">
          作業報告
          <span className="ml-2 text-xs font-normal text-muted">{reports.length} 件</span>
        </h2>

        {reports.length === 0 ? (
          <div className="rounded-lg border border-border bg-surface py-10 text-center">
            <p className="text-sm text-muted">作業報告はまだありません</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reports.map((report) => (
              <div key={report.id} className="rounded-lg border border-border bg-surface p-4">
                <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                  <div className="flex items-center gap-4 text-xs text-muted">
                    <span>作業日：{formatDate(report.worked_at)}</span>
                    <span>登録：{formatDate(report.created_at)}</span>
                  </div>
                  <ReportCardActions reportId={report.id} orderId={order.id} />
                </div>
                <p className="text-sm text-foreground whitespace-pre-wrap">{report.content}</p>
                {report.photo_urls.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {report.photo_urls.map((url, i) => (
                      <a key={url} href={url} target="_blank" rel="noopener noreferrer">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url}
                          alt={`報告写真 ${i + 1}`}
                          className="w-16 h-16 object-cover rounded border border-border"
                        />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
