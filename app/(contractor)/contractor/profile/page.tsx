import type { Metadata }        from "next";
import { supabaseAdmin }         from "@/lib/supabase";
import { getContractorSession }  from "@/lib/contractor-session";
import { ChangeRequestSection }  from "./_components/ChangeRequestSection";

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

function TagRow({ label, tags }: { label: string; tags: string[] }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 py-3 border-b border-border last:border-0">
      <dt className="w-32 shrink-0 text-xs text-muted font-medium">{label}</dt>
      <dd className="flex flex-wrap gap-1.5">
        {tags.length > 0 ? (
          tags.map((t) => (
            <span
              key={t}
              className="text-xs border border-border px-2 py-0.5 rounded-full text-foreground"
            >
              {t}
            </span>
          ))
        ) : (
          <span className="text-sm text-foreground">—</span>
        )}
      </dd>
    </div>
  );
}

const STATUS_LABEL: Record<string, string> = {
  PENDING:  "審査中",
  ACTIVE:   "承認済み",
  INACTIVE: "停止中",
};

const STATUS_COLOR: Record<string, { bg: string; color: string }> = {
  PENDING:  { bg: "#FEF3C7", color: "#92400E" },
  ACTIVE:   { bg: "#D1FAE5", color: "#065F46" },
  INACTIVE: { bg: "#F3F4F6", color: "#6B7280" },
};

export default async function ContractorProfilePage() {
  const contractor = await getContractorSession();

  const { data: raw } = await supabaseAdmin
    .from("contractors")
    .select("*")
    .eq("id", contractor.id)
    .maybeSingle();

  if (!raw) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-sm text-muted mb-2">業者情報が取得できませんでした。</p>
        <p className="text-xs text-muted">管理者にお問い合わせください。</p>
      </div>
    );
  }

  const areas        = (raw.areas         as string[]) ?? [];
  const serviceTypes = (raw.service_types  as string[]) ?? [];
  const statusStyle  = STATUS_COLOR[raw.status] ?? STATUS_COLOR.INACTIVE;

  return (
    <div className="space-y-6 max-w-2xl">
      {/* ヘッダー */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-foreground">自社情報</h1>
          <p className="mt-1 text-sm text-muted">登録情報の確認</p>
        </div>
        <span
          style={{
            display:         "inline-flex",
            alignItems:      "center",
            height:          "24px",
            padding:         "0 10px",
            borderRadius:    "9999px",
            fontSize:        "11px",
            fontWeight:      600,
            backgroundColor: statusStyle.bg,
            color:           statusStyle.color,
          } as React.CSSProperties}
        >
          {STATUS_LABEL[raw.status] ?? raw.status}
        </span>
      </div>

      {/* 基本情報 */}
      <div className="rounded-lg border border-border bg-surface p-6">
        <h2 className="text-sm font-semibold text-foreground mb-2">基本情報</h2>
        <dl>
          <Row label="会社名"    value={raw.company_name} />
          <Row label="代表者名"  value={raw.owner_name} />
          <Row label="住所"      value={raw.address} />
          <Row label="電話番号"  value={raw.phone} />
          <Row label="メール"    value={raw.email} />
          <Row label="自己紹介"  value={raw.bio} />
          <TagRow label="対応エリア" tags={areas} />
          <TagRow label="作業種別"   tags={serviceTypes} />
        </dl>
      </div>

      {/* クレジット残高 */}
      <div className="rounded-lg border border-border bg-surface p-6">
        <h2 className="text-sm font-semibold text-foreground mb-4">クレジット残高</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
          <div>
            <p className="text-xs text-muted mb-1">残高</p>
            <p className="text-2xl font-bold text-foreground tabular-nums">
              {(raw.credit_balance as number).toLocaleString()}
              <span className="text-sm font-normal text-muted ml-1">pt</span>
            </p>
          </div>
          <div>
            <p className="text-xs text-muted mb-1">上限</p>
            <p className="text-2xl font-bold text-foreground tabular-nums">
              {(raw.credit_limit as number).toLocaleString()}
              <span className="text-sm font-normal text-muted ml-1">pt</span>
            </p>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <p className="text-xs text-muted mb-1">使用率</p>
            {raw.credit_limit > 0 ? (
              <>
                <p className="text-2xl font-bold text-foreground tabular-nums">
                  {Math.round((raw.credit_balance / raw.credit_limit) * 100)}
                  <span className="text-sm font-normal text-muted ml-0.5">%</span>
                </p>
                <div
                  style={{
                    marginTop:    "6px",
                    height:       "4px",
                    borderRadius: "2px",
                    backgroundColor: "#E5E7EB",
                    overflow:     "hidden",
                  } as React.CSSProperties}
                >
                  <div
                    style={{
                      height:          "100%",
                      borderRadius:    "2px",
                      backgroundColor: "#1a1a1a",
                      width: `${Math.min(100, Math.round((raw.credit_balance / raw.credit_limit) * 100))}%`,
                    } as React.CSSProperties}
                  />
                </div>
              </>
            ) : (
              <p className="text-2xl font-bold text-foreground">—</p>
            )}
          </div>
        </div>
      </div>

      {/* 変更申請 */}
      <ChangeRequestSection />
    </div>
  );
}
