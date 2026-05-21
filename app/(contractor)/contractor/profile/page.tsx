import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession }    from "@/lib/auth-helpers";
import { supabaseAdmin } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "自社情報 | ServiceHub 業者ポータル",
};

function Row({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 py-3 border-b border-border last:border-0">
      <dt className="w-32 shrink-0 text-xs text-muted font-medium">{label}</dt>
      <dd className="text-sm text-foreground">{value || "—"}</dd>
    </div>
  );
}

export default async function ContractorProfilePage() {
  const session = await getSession();
  if (!session) redirect("/contractor/login");

  const { data: contractor } = await supabaseAdmin
    .from("contractors")
    .select("*")
    .eq("user_id", session.user.id)
    .maybeSingle();

  if (!contractor) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-sm text-muted mb-2">業者アカウントが紐付けられていません。</p>
        <p className="text-xs text-muted">管理者にお問い合わせください。</p>
      </div>
    );
  }

  const areas        = (contractor.areas        as string[]) ?? [];
  const serviceTypes = (contractor.service_types as string[]) ?? [];

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-foreground">自社情報</h1>
        <p className="mt-1 text-sm text-muted">登録情報の確認。変更は管理者にお問い合わせください。</p>
      </div>

      <div className="rounded-lg border border-border bg-surface p-6">
        <dl>
          <Row label="会社名"    value={contractor.company_name} />
          <Row label="代表者名"  value={contractor.owner_name} />
          <Row label="住所"      value={contractor.address} />
          <Row label="電話番号"  value={contractor.phone} />
          <Row label="メール"    value={contractor.email} />
          <Row label="自己紹介"  value={contractor.bio} />
          <div className="flex flex-col sm:flex-row sm:items-start gap-1 py-3 border-b border-border">
            <dt className="w-32 shrink-0 text-xs text-muted font-medium">対応エリア</dt>
            <dd className="flex flex-wrap gap-1.5">
              {areas.length > 0 ? areas.map((a) => (
                <span key={a} className="text-xs border border-border px-2 py-0.5 rounded-full text-foreground">
                  {a}
                </span>
              )) : <span className="text-sm text-foreground">—</span>}
            </dd>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-start gap-1 py-3">
            <dt className="w-32 shrink-0 text-xs text-muted font-medium">作業種別</dt>
            <dd className="flex flex-wrap gap-1.5">
              {serviceTypes.length > 0 ? serviceTypes.map((s) => (
                <span key={s} className="text-xs border border-border px-2 py-0.5 rounded-full text-foreground">
                  {s}
                </span>
              )) : <span className="text-sm text-foreground">—</span>}
            </dd>
          </div>
        </dl>
      </div>

      <div className="rounded-lg border border-border bg-surface p-6">
        <h2 className="text-sm font-semibold text-foreground mb-3">クレジット残高</h2>
        <div className="flex gap-8">
          <div>
            <p className="text-xs text-muted mb-1">残高</p>
            <p className="text-2xl font-bold text-foreground">
              {contractor.credit_balance.toLocaleString()}
              <span className="text-sm font-normal text-muted ml-1">pt</span>
            </p>
          </div>
          <div>
            <p className="text-xs text-muted mb-1">上限</p>
            <p className="text-2xl font-bold text-foreground">
              {contractor.credit_limit.toLocaleString()}
              <span className="text-sm font-normal text-muted ml-1">pt</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
