import { Noto_Sans_JP } from "next/font/google";
import { redirect } from "next/navigation";
import { getSession }    from "@/lib/auth-helpers";
import { supabaseAdmin } from "@/lib/supabase";
import { ContractorShell } from "./_components/ContractorShell";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans",
  display: "swap",
});

export default async function ContractorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // 未認証またはCONTRACTORロール以外はログインへリダイレクト
  // ※ ログインページ自体は (auth) ルートグループ配下のため、このlayoutは通らない
  if (!session || session.user.role !== "CONTRACTOR") {
    redirect("/contractor/login");
  }

  // 業者の会社名をDBから取得してヘッダーに表示
  const { data: contractor } = await supabaseAdmin
    .from("contractors")
    .select("company_name")
    .eq("user_id", session.user.id)
    .maybeSingle();

  const userName = contractor?.company_name ?? session.user.name ?? session.user.email ?? "業者";

  return (
    <div className={`${notoSansJP.variable} flex flex-1 flex-col`}>
      <ContractorShell userName={userName}>{children}</ContractorShell>
    </div>
  );
}
