"use client";

import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

type Post = {
  id:           string;
  title:        string;
  area:         string | null;
  service_type: string | null;
  published:    boolean;
  created_at:   string;
  updated_at:   string;
};

export function CmsPostTable({ posts }: { posts: Post[] }) {
  const router = useRouter();

  if (posts.length === 0) {
    return (
      <p className="text-sm text-muted text-center py-12">
        事例記事がありません。「新規作成」から追加してください。
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-border bg-accent/30">
            <th className="px-4 py-3 text-xs font-semibold text-muted">タイトル</th>
            <th className="px-4 py-3 text-xs font-semibold text-muted hidden sm:table-cell">エリア</th>
            <th className="px-4 py-3 text-xs font-semibold text-muted hidden md:table-cell">作業種別</th>
            <th className="px-4 py-3 text-xs font-semibold text-muted">公開状態</th>
            <th className="px-4 py-3 text-xs font-semibold text-muted hidden lg:table-cell">更新日</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr
              key={post.id}
              onClick={() => router.push(`/admin/cms/${post.id}`)}
              className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors cursor-pointer"
            >
              <td className="px-4 py-3 text-sm font-medium text-foreground max-w-xs truncate">
                {post.title}
              </td>
              <td className="px-4 py-3 text-sm text-muted hidden sm:table-cell">
                {post.area ?? "—"}
              </td>
              <td className="px-4 py-3 text-sm text-muted hidden md:table-cell">
                {post.service_type ?? "—"}
              </td>
              <td className="px-4 py-3">
                <Badge variant={post.published ? "success" : "default"}>
                  {post.published ? "公開中" : "非公開"}
                </Badge>
              </td>
              <td className="px-4 py-3 text-xs text-muted hidden lg:table-cell tabular-nums">
                {new Date(post.updated_at).toLocaleDateString("ja-JP")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
