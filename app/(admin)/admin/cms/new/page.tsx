import Link from "next/link";
import type { Metadata } from "next";
import { CmsPostForm } from "../[id]/_components/CmsPostForm";
import { createPost }  from "./actions";

export const metadata: Metadata = {
  title: "事例を新規作成 | CMS | ServiceHub Admin",
};

export default function AdminCmsNewPage() {
  return (
    <div className="space-y-6">
      {/* ヘッダー */}
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
        <h1 className="text-xl font-bold text-foreground">事例を新規作成</h1>
        <p className="mt-0.5 text-xs text-muted">保存後は自動的に編集ページへ移動します（初期状態は非公開）</p>
      </div>

      <div className="rounded-lg border border-border bg-surface p-6">
        <CmsPostForm action={createPost} />
      </div>
    </div>
  );
}
