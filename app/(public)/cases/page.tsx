import type { Metadata } from "next";
import { supabaseAdmin } from "@/lib/supabase";
import { CaseCard } from "./_components/CaseCard";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "施工事例 | ServiceHub",
  description: "ServiceHubが手がけたリフォーム・清掃・水道工事などの施工事例をご紹介します。",
};

export default async function CasesPage() {
  const { data: posts } = await supabaseAdmin
    .from("cms_posts")
    .select("id, title, area, completed_at, image_urls")
    .eq("published", true)
    .order("created_at", { ascending: false });

  return (
    <div className="bg-paper min-h-screen px-6 py-16 md:py-24">
      <div className="mx-auto max-w-5xl">
        {/* ページタイトル */}
        <div className="mb-12">
          <p className="text-xs font-medium tracking-[0.3em] uppercase text-muted mb-3">
            Cases
          </p>
          <h1 className="font-serif text-3xl md:text-4xl tracking-tight text-ink">
            施工事例
          </h1>
        </div>

        {/* 事例グリッド */}
        {!posts || posts.length === 0 ? (
          <p className="text-sm text-muted">事例を準備中です</p>
        ) : (
          // 3カラムグリッド：index % 4 が 0 or 3 → 大（col-span-2）、1 or 2 → 小（col-span-1）
          // パターン: [大][小] / [小][大] / [大][小] …
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-10">
            {posts.map((post, index) => {
              const isLarge = index % 4 === 0 || index % 4 === 3;
              return (
                <div
                  key={post.id}
                  className={isLarge ? "md:col-span-2" : "md:col-span-1"}
                >
                  <CaseCard
                    id={post.id}
                    title={post.title}
                    area={post.area}
                    completedAt={post.completed_at}
                    imageUrl={post.image_urls?.[0] ?? null}
                    size={isLarge ? "large" : "small"}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
