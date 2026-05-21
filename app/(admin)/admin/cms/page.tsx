import type { Metadata } from "next";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import { CmsPostTable } from "./_components/CmsPostTable";

export const metadata: Metadata = {
  title: "CMS 事例管理 | ServiceHub Admin",
};

type SearchParams = Promise<{ published?: string }>;

export default async function AdminCmsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { published } = await searchParams;
  const showPublished = published === "false" ? false : published === "true" ? true : null;

  let query = supabaseAdmin
    .from("cms_posts")
    .select("id, title, area, service_type, published, created_at, updated_at")
    .order("updated_at", { ascending: false });

  if (showPublished !== null) query = query.eq("published", showPublished);

  const { data: raw } = await query;
  const posts = (raw ?? []) as Array<{
    id:           string;
    title:        string;
    area:         string | null;
    service_type: string | null;
    published:    boolean;
    created_at:   string;
    updated_at:   string;
  }>;

  const tabs = [
    { label: "すべて",    value: ""      },
    { label: "公開中",    value: "true"  },
    { label: "非公開",    value: "false" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-foreground">CMS 事例管理</h1>
          <p className="mt-1 text-sm text-muted">{posts.length} 件</p>
        </div>
        <Link
          href="/admin/cms/new"
          style={{
            display:         "inline-flex",
            alignItems:      "center",
            gap:             "6px",
            height:          "40px",
            padding:         "0 16px",
            borderRadius:    "4px",
            fontSize:        "14px",
            fontWeight:      500,
            backgroundColor: "#1a1a1a",
            color:           "#ffffff",
            textDecoration:  "none",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <path d="M12 5v14M5 12h14" />
          </svg>
          新規作成
        </Link>
      </div>

      {/* タブフィルター */}
      <div className="flex gap-1 border-b border-border">
        {tabs.map((tab) => {
          const active = (published ?? "") === tab.value;
          return (
            <Link
              key={tab.value}
              href={tab.value ? `/admin/cms?published=${tab.value}` : "/admin/cms"}
              style={{
                display:        "inline-flex",
                alignItems:     "center",
                height:         "36px",
                padding:        "0 14px",
                fontSize:       "13px",
                fontWeight:     active ? 600 : 400,
                color:          active ? "#1a1a1a" : "#888",
                borderBottom:   active ? "2px solid #1a1a1a" : "2px solid transparent",
                textDecoration: "none",
                marginBottom:   "-1px",
              }}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      <div className="rounded-lg border border-border bg-surface overflow-hidden">
        <CmsPostTable posts={posts} />
      </div>
    </div>
  );
}
