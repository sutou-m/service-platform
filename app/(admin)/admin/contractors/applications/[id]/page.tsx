import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { supabaseAdmin }       from "@/lib/supabase";
import { ApplicationActions }  from "./_components/ApplicationActions";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { data } = await supabaseAdmin
    .from("contractors")
    .select("company_name")
    .eq("id", id)
    .single();
  return { title: data ? `${data.company_name} | 申請詳細` : "申請詳細" };
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

function TagList({ items }: { items: string[] }) {
  if (items.length === 0) return <p className="text-sm text-muted">未設定</p>;
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-full px-2.5 py-0.5 text-xs"
          style={{ backgroundColor: "#f5f5f5", color: "#1a1a1a", border: "1px solid #e0e0e0" }}
        >
          {item}
        </span>
      ))}
    </div>
  );
}

export default async function ApplicationDetailPage({ params }: Props) {
  const { id } = await params;

  const { data: contractor } = await supabaseAdmin
    .from("contractors")
    .select("*")
    .eq("id", id)
    .eq("status", "PENDING")
    .single();

  if (!contractor) notFound();

  const areas        = (contractor.areas         as string[]) ?? [];
  const serviceTypes = (contractor.service_types as string[]) ?? [];

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div>
        <Link
          href="/admin/contractors/applications"
          className="inline-flex items-center gap-1 text-xs text-muted hover:text-foreground transition-colors mb-2"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="m15 18-6-6 6-6" />
          </svg>
          申請一覧に戻る
        </Link>
        <h1 className="text-xl font-bold text-foreground">{contractor.company_name}</h1>
        <p className="mt-0.5 text-xs text-muted">
          申請日：{new Date(contractor.created_at).toLocaleString("ja-JP")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左: 申請内容 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 基本情報 */}
          <div className="rounded-lg border border-border bg-surface p-6">
            <h2 className="text-sm font-semibold text-foreground mb-4">基本情報</h2>
            <dl>
              <Row label="会社名"         value={contractor.company_name} />
              <Row label="代表者名"       value={contractor.owner_name} />
              <Row label="住所"           value={contractor.address} />
              <Row label="電話番号"       value={contractor.phone} />
              <Row label="メールアドレス" value={contractor.email} />
            </dl>
          </div>

          {/* 対応可能エリア */}
          <div className="rounded-lg border border-border bg-surface p-6">
            <h2 className="text-sm font-semibold text-foreground mb-3">対応可能エリア</h2>
            <TagList items={areas} />
          </div>

          {/* 対応作業種別 */}
          <div className="rounded-lg border border-border bg-surface p-6">
            <h2 className="text-sm font-semibold text-foreground mb-3">対応作業種別</h2>
            <TagList items={serviceTypes} />
          </div>

          {/* 自己紹介・実績 */}
          {contractor.bio && (
            <div className="rounded-lg border border-border bg-surface p-6">
              <h2 className="text-sm font-semibold text-foreground mb-3">自己紹介・実績</h2>
              <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                {contractor.bio}
              </p>
            </div>
          )}
        </div>

        {/* 右: 審査アクション */}
        <div>
          <ApplicationActions contractorId={contractor.id} />
        </div>
      </div>
    </div>
  );
}
