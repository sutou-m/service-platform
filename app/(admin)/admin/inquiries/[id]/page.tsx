import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { supabaseAdmin } from "@/lib/supabase";
import { InquiryStatusBadge } from "@/components/ui/status-badge";
import { InquiryActions } from "./_components/InquiryActions";
import { MemoForm }       from "./_components/MemoForm";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { data } = await supabaseAdmin
    .from("inquiries")
    .select("name")
    .eq("id", id)
    .single();
  return { title: data ? `${data.name} 様 | 問い合わせ詳細` : "問い合わせ詳細" };
}

function DetailRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex gap-4 py-3 border-b border-border last:border-0">
      <dt className="w-28 shrink-0 text-xs font-medium text-muted">{label}</dt>
      <dd className="text-sm text-foreground whitespace-pre-wrap">{value}</dd>
    </div>
  );
}

export default async function AdminInquiryDetailPage({ params }: Props) {
  const { id } = await params;

  const { data: inquiry } = await supabaseAdmin
    .from("inquiries")
    .select("*")
    .eq("id", id)
    .single();

  if (!inquiry) notFound();

  const createdAt   = new Date(inquiry.created_at).toLocaleString("ja-JP");
  const preferredAt = inquiry.preferred_at
    ? new Date(inquiry.preferred_at).toLocaleString("ja-JP")
    : null;

  return (
    <div className="space-y-6">
      {/* ページヘッダー */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <Link
            href="/admin/inquiries"
            className="inline-flex items-center gap-1 text-xs text-muted hover:text-foreground transition-colors mb-2"
          >
            <svg
              width="12" height="12" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            一覧に戻る
          </Link>
          <h1 className="text-xl font-bold text-foreground">
            {inquiry.name} 様のお問い合わせ
          </h1>
          <p className="mt-0.5 text-xs text-muted">{createdAt} 受付</p>
        </div>
        <InquiryStatusBadge status={inquiry.status} />
      </div>

      {/* 2カラムレイアウト */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左: 問い合わせ内容 + 写真 */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-lg border border-border bg-surface p-6">
            <h2 className="text-sm font-semibold text-foreground mb-4">お問い合わせ内容</h2>
            <dl>
              <DetailRow label="氏名"         value={inquiry.name} />
              <DetailRow label="電話番号"     value={inquiry.phone} />
              <DetailRow label="メール"       value={inquiry.email} />
              <DetailRow label="住所"         value={inquiry.address} />
              <DetailRow label="希望作業内容" value={inquiry.work_content} />
              <DetailRow label="希望日時"     value={preferredAt} />
              <DetailRow label="備考"         value={inquiry.notes} />
            </dl>
          </div>

          {inquiry.photo_urls?.length > 0 && (
            <div className="rounded-lg border border-border bg-surface p-6">
              <h2 className="text-sm font-semibold text-foreground mb-4">
                添付写真（{inquiry.photo_urls.length}枚）
              </h2>
              <div className="flex flex-wrap gap-3">
                {(inquiry.photo_urls as string[]).map((url, i) => (
                  <a
                    key={url}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block"
                  >
                    <div className="relative h-24 w-24 overflow-hidden rounded border border-border group-hover:border-foreground transition-colors">
                      <Image
                        src={url}
                        alt={`添付写真 ${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 右: アクション + メモ */}
        <div className="space-y-6">
          <InquiryActions inquiry={{ id: inquiry.id, status: inquiry.status }} />
          <MemoForm inquiryId={inquiry.id} currentMemo={inquiry.memo} />
        </div>
      </div>
    </div>
  );
}
