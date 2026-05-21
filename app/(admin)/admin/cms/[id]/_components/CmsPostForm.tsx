"use client";

import { useActionState, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Input }    from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert }    from "@/components/ui/alert";
import { SERVICE_TYPES } from "@/lib/data/service-types";

export type ActionResult = { error?: string; success?: boolean };

export type CmsPost = {
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
};

type Props = {
  action: (prev: ActionResult | null, formData: FormData) => Promise<ActionResult>;
  post?:  CmsPost;
};

const selectStyle: React.CSSProperties = {
  width:           "100%",
  height:          "40px",
  padding:         "0 10px",
  borderRadius:    "4px",
  border:          "1px solid #e0e0e0",
  fontSize:        "14px",
  backgroundColor: "#ffffff",
  color:           "#1a1a1a",
  cursor:          "pointer",
};

function SubmitBtn({ pending }: { pending: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending}
      style={{
        height:          "40px",
        padding:         "0 20px",
        borderRadius:    "4px",
        fontSize:        "14px",
        fontWeight:      600,
        cursor:          pending ? "not-allowed" : "pointer",
        backgroundColor: "#1a1a1a",
        color:           "#ffffff",
        border:          "none",
        opacity:         pending ? 0.6 : 1,
      } as React.CSSProperties}
    >
      {pending ? "保存中..." : "保存する"}
    </button>
  );
}

export function CmsPostForm({ action, post }: Props) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(action, null);

  const [title,       setTitle]       = useState(post?.title ?? "");
  const [slug,        setSlug]        = useState(post?.slug ?? "");
  const [description, setDescription] = useState(post?.description ?? "");
  const [content,     setContent]     = useState(post?.content ?? "");
  const [area,        setArea]        = useState(post?.area ?? "");
  const [serviceType, setServiceType] = useState(post?.service_type ?? "");
  const [completedAt, setCompletedAt] = useState(
    post?.completed_at ? new Date(post.completed_at).toISOString().slice(0, 10) : ""
  );

  const [existingImages, setExistingImages] = useState<string[]>(post?.image_urls ?? []);
  const [newPreviews,    setNewPreviews]    = useState<{ url: string; name: string }[]>([]);
  const [newFiles,       setNewFiles]       = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state?.success) router.refresh();
  }, [state]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);

    const oversized = files.filter((f) => f.size > 5 * 1024 * 1024);
    if (oversized.length > 0) {
      alert(`画像のサイズが大きすぎます。1枚あたり5MB以下にしてください。\n（超過: ${oversized.map((f) => f.name).join(", ")}）`);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const allowed = files.filter((f) => ["image/jpeg", "image/png", "image/webp"].includes(f.type));
    const remaining = Math.max(0, 10 - existingImages.length - newFiles.length);
    const toAdd = allowed.slice(0, remaining);
    setNewFiles((prev) => [...prev, ...toAdd]);
    setNewPreviews((prev) => [
      ...prev,
      ...toAdd.map((f) => ({ url: URL.createObjectURL(f), name: f.name })),
    ]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeExisting(url: string) {
    setExistingImages((prev) => prev.filter((u) => u !== url));
  }

  function removeNew(index: number) {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
    setNewPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  const totalImages = existingImages.length + newFiles.length;

  return (
    <form action={formAction} className="space-y-6">
      {post && <input type="hidden" name="postId" value={post.id} />}
      {existingImages.map((url) => (
        <input key={url} type="hidden" name="keepImages" value={url} />
      ))}
      {/* 新規ファイルを hidden input 経由では渡せないため DataTransfer を使う */}
      {/* 実際のファイルは隠し input[type=file] にセットして送信 */}

      {state?.error && <Alert variant="danger">{state.error}</Alert>}
      {state?.success && <Alert variant="success">保存しました</Alert>}

      {/* タイトル */}
      <div>
        <label className="block text-xs font-medium text-muted mb-1.5">
          タイトル <span className="text-danger">*</span>
        </label>
        <Input
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="例：東京都・エアコン取付工事"
          required
        />
      </div>

      {/* スラッグ */}
      <div>
        <label className="block text-xs font-medium text-muted mb-1.5">
          スラッグ（URL） <span className="text-danger">*</span>
        </label>
        <Input
          name="slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
          placeholder="tokyo-aircon-2024"
          required
        />
        <p className="mt-1 text-xs text-muted">英小文字・数字・ハイフンのみ。URLに使用されます。</p>
      </div>

      {/* エリア・種別・完了日 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-muted mb-1.5">対応エリア</label>
          <Input
            name="area"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="例：東京都"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted mb-1.5">作業種別</label>
          <select
            name="service_type"
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
            style={selectStyle}
          >
            <option value="">— 選択 —</option>
            {SERVICE_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-muted mb-1.5">完了日</label>
          <Input
            name="completed_at"
            type="date"
            value={completedAt}
            onChange={(e) => setCompletedAt(e.target.value)}
          />
        </div>
      </div>

      {/* 概要 */}
      <div>
        <label className="block text-xs font-medium text-muted mb-1.5">概要</label>
        <Textarea
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="一覧ページに表示される短い説明文（任意）"
        />
      </div>

      {/* 本文 */}
      <div>
        <label className="block text-xs font-medium text-muted mb-1.5">
          本文（Markdown） <span className="text-danger">*</span>
        </label>
        <Textarea
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={14}
          placeholder={"# 見出し\n\n本文をMarkdown形式で記述してください。"}
          required
          className="font-mono text-xs"
        />
      </div>

      {/* 画像 */}
      <div>
        <label className="block text-xs font-medium text-muted mb-1.5">
          画像（最大10枚・JPEG/PNG/WebP）
        </label>

        {/* 既存画像プレビュー */}
        {existingImages.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-muted mb-2">登録済み画像</p>
            <div className="flex flex-wrap gap-3">
              {existingImages.map((url) => (
                <div key={url} className="relative group">
                  <img
                    src={url}
                    alt=""
                    className="w-20 h-20 object-cover rounded border border-border"
                  />
                  <button
                    type="button"
                    onClick={() => removeExisting(url)}
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs transition-opacity"
                    style={{ backgroundColor: "#ef4444", color: "#fff", border: "none", cursor: "pointer" }}
                    title="削除"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 新規プレビュー */}
        {newPreviews.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-muted mb-2">追加する画像</p>
            <div className="flex flex-wrap gap-3">
              {newPreviews.map((p, i) => (
                <div key={p.url} className="relative group">
                  <img
                    src={p.url}
                    alt={p.name}
                    className="w-20 h-20 object-cover rounded border border-border"
                  />
                  <button
                    type="button"
                    onClick={() => removeNew(i)}
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs"
                    style={{ backgroundColor: "#ef4444", color: "#fff", border: "none", cursor: "pointer" }}
                    title="削除"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ファイル選択（新規ファイルを name="images" で送信） */}
        <NewImagesInput
          files={newFiles}
          onFileChange={handleFileChange}
          fileInputRef={fileInputRef}
          disabled={totalImages >= 10}
        />
        {totalImages >= 10 && (
          <p className="mt-1 text-xs text-muted">上限（10枚）に達しています</p>
        )}
      </div>

      {/* 保存ボタン */}
      <div className="flex justify-end pt-2 border-t border-border">
        <SubmitBtn pending={pending} />
      </div>
    </form>
  );
}

// name="images" で複数ファイルを渡すためのサブコンポーネント
function NewImagesInput({
  files,
  onFileChange,
  fileInputRef,
  disabled,
}: {
  files:         File[];
  onFileChange:  (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef:  React.RefObject<HTMLInputElement | null>;
  disabled:      boolean;
}) {
  // ファイルリストを input に反映
  const hiddenRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!hiddenRef.current) return;
    const dt = new DataTransfer();
    files.forEach((f) => dt.items.add(f));
    hiddenRef.current.files = dt.files;
  }, [files]);

  return (
    <>
      {/* フォーム送信用の hidden input（files ステートと同期） */}
      <input ref={hiddenRef} type="file" name="images" multiple accept="image/jpeg,image/png,image/webp" className="hidden" />
      {/* ユーザー操作用の visible input */}
      <label
        style={{
          display:         "inline-flex",
          alignItems:      "center",
          gap:             "6px",
          height:          "36px",
          padding:         "0 14px",
          borderRadius:    "4px",
          border:          "1px solid #e0e0e0",
          fontSize:        "13px",
          backgroundColor: disabled ? "#f5f5f5" : "#ffffff",
          color:           disabled ? "#aaa" : "#1a1a1a",
          cursor:          disabled ? "not-allowed" : "pointer",
        } as React.CSSProperties}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        画像を選択
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          onChange={onFileChange}
          disabled={disabled}
          className="hidden"
        />
      </label>
    </>
  );
}
