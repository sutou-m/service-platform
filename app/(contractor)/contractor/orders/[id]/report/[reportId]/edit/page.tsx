import type { Metadata }       from "next";
import Link                     from "next/link";
import { notFound }             from "next/navigation";
import { supabaseAdmin }        from "@/lib/supabase";
import { getContractorSession } from "@/lib/contractor-session";
import { EditReportForm }       from "./_components/EditReportForm";

type Props = { params: Promise<{ id: string; reportId: string }> };

export const metadata: Metadata = {
  title: "作業報告編集 | ServiceHub 業者ポータル",
};

export default async function EditReportPage({ params }: Props) {
  const { id: orderId, reportId } = await params;
  const contractor = await getContractorSession();

  const [{ data: rawOrder }, { data: rawReport }] = await Promise.all([
    supabaseAdmin
      .from("orders")
      .select("id, work_content, work_address, contractor_id")
      .eq("id", orderId)
      .maybeSingle(),
    supabaseAdmin
      .from("order_reports")
      .select("id, worked_at, content, photo_urls, contractor_id")
      .eq("id", reportId)
      .maybeSingle(),
  ]);

  if (!rawOrder || rawOrder.contractor_id !== contractor.id) notFound();
  if (!rawReport || rawReport.contractor_id !== contractor.id) notFound();

  const order = rawOrder as {
    id:            string;
    work_content:  string;
    work_address:  string;
    contractor_id: string;
  };

  const report = rawReport as {
    id:         string;
    worked_at:  string;
    content:    string;
    photo_urls: string[];
    contractor_id: string;
  };

  // datetime-local input requires "YYYY-MM-DDTHH:mm" format
  const workedAtLocal = new Date(report.worked_at)
    .toLocaleString("sv-SE", { timeZone: "Asia/Tokyo" })
    .replace(" ", "T")
    .slice(0, 16);

  return (
    <div className="space-y-6 max-w-2xl">
      <Link
        href={`/contractor/orders/${orderId}`}
        className="inline-flex items-center gap-1 text-xs text-muted hover:text-foreground transition-colors"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="m15 18-6-6 6-6" />
        </svg>
        案件詳細に戻る
      </Link>

      <div>
        <h1 className="text-xl font-bold text-foreground">作業報告編集</h1>
        <p className="mt-1 text-sm text-muted">{order.work_content}</p>
      </div>

      <div className="rounded-lg border border-border bg-surface p-4">
        <dl className="flex flex-col sm:flex-row gap-4 text-sm">
          <div className="flex-1">
            <dt className="text-xs text-muted font-medium mb-0.5">作業内容</dt>
            <dd className="text-foreground">{order.work_content}</dd>
          </div>
          <div className="flex-1">
            <dt className="text-xs text-muted font-medium mb-0.5">作業場所</dt>
            <dd className="text-foreground">{order.work_address}</dd>
          </div>
        </dl>
      </div>

      <div className="rounded-lg border border-border bg-surface p-5">
        <EditReportForm
          reportId={report.id}
          orderId={orderId}
          defaultWorkedAt={workedAtLocal}
          defaultContent={report.content}
          existingPhotoUrls={report.photo_urls ?? []}
        />
      </div>
    </div>
  );
}
