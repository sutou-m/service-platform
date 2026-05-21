import type { Metadata }       from "next";
import Link                     from "next/link";
import { notFound }             from "next/navigation";
import { supabaseAdmin }        from "@/lib/supabase";
import { getContractorSession } from "@/lib/contractor-session";
import { ReportForm }           from "./_components/ReportForm";

type Props = { params: Promise<{ id: string }> };

export const metadata: Metadata = {
  title: "作業報告登録 | ServiceHub 業者ポータル",
};

export default async function ContractorReportPage({ params }: Props) {
  const { id }    = await params;
  const contractor = await getContractorSession();

  const { data: rawOrder } = await supabaseAdmin
    .from("orders")
    .select("id, work_content, work_address, contractor_id")
    .eq("id", id)
    .maybeSingle();

  if (!rawOrder) notFound();
  if (rawOrder.contractor_id !== contractor.id) notFound();

  const order = rawOrder as {
    id:            string;
    work_content:  string;
    work_address:  string;
    contractor_id: string;
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* 戻るリンク */}
      <Link
        href={`/contractor/orders/${order.id}`}
        className="inline-flex items-center gap-1 text-xs text-muted hover:text-foreground transition-colors"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="m15 18-6-6 6-6" />
        </svg>
        案件詳細に戻る
      </Link>

      {/* ヘッダー */}
      <div>
        <h1 className="text-xl font-bold text-foreground">作業報告登録</h1>
        <p className="mt-1 text-sm text-muted">{order.work_content}</p>
      </div>

      {/* 案件情報 */}
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

      {/* 報告フォーム */}
      <div className="rounded-lg border border-border bg-surface p-5">
        <ReportForm orderId={order.id} />
      </div>
    </div>
  );
}
