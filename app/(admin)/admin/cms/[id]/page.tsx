import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { supabaseAdmin }  from "@/lib/supabase";
import { Badge }          from "@/components/ui/badge";
import { CmsPostForm }    from "./_components/CmsPostForm";
import { PublishToggle }  from "./_components/PublishToggle";
import { DeleteButton }   from "./_components/DeleteButton";
import { updatePost }     from "./actions";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { data } = await supabaseAdmin
    .from("cms_posts")
    .select("title")
    .eq("id", id)
    .single();
  return { title: `${data?.title ?? "編集"} | CMS | ServiceHub Admin` };
}

export default async function AdminCmsEditPage({ params }: Props) {
  const { id } = await params;

  const { data: raw } = await supabaseAdmin
    .from("cms_posts")
    .select("*")
    .eq("id", id)
    .single();

  if (!raw) notFound();

  const post = raw as {
    id:           string;
    title:        string;
    slug:         string;
    description:  string | null;
    content:      string;
    area:         string | null;
    service_type: string | null;
    completed_at: string | null;
    image_urls:   string[];
    published:    boolean;
    created_at:   string;
    updated_at:   string;
  };

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <Link
            href="/admin/cms"
            className="inline-flex items-center gap-1 text-xs text-muted hover:text-foreground transition-colors mb-2"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="m15 18-6-6 6-6" />
            </svg>
            事例一覧に戻る
          </Link>
          <h1 className="text-xl font-bold text-foreground line-clamp-1">{post.title}</h1>
          <p className="mt-0.5 text-xs text-muted">
            更新：{new Date(post.updated_at).toLocaleString("ja-JP")}
          </p>
        </div>
        <Badge variant={post.published ? "success" : "default"}>
          {post.published ? "公開中" : "非公開"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左: 編集フォーム */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-border bg-surface p-6">
            <CmsPostForm action={updatePost} post={post} />
          </div>
        </div>

        {/* 右: 操作パネル */}
        <div className="space-y-4">
          {/* 公開/非公開 */}
          <div className="rounded-lg border border-border bg-surface p-5">
            <PublishToggle postId={post.id} published={post.published} />
          </div>

          {/* 公開サイトリンク */}
          {post.published && (
            <div className="rounded-lg border border-border bg-surface p-5">
              <p className="text-xs font-medium text-muted mb-3">公開ページ</p>
              <a
                href={`/cases/${post.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted hover:text-foreground underline-offset-4 hover:underline transition-colors"
              >
                公開ページを確認 →
              </a>
            </div>
          )}

          {/* 削除 */}
          <div className="rounded-lg border border-border bg-surface p-5">
            <DeleteButton postId={post.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
