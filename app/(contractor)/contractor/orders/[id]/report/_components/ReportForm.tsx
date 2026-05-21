"use client";

import { useActionState, useState, useRef, useEffect } from "react";
import { Input }    from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert }    from "@/components/ui/alert";
import { submitReport, type ActionResult } from "../actions";

export function ReportForm({ orderId }: { orderId: string }) {
  const action = submitReport.bind(null, orderId);
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(action, null);

  const [previews,     setPreviews]     = useState<{ url: string; name: string }[]>([]);
  const [files,        setFiles]        = useState<File[]>([]);
  const fileInputRef   = useRef<HTMLInputElement>(null);
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  // files ステートを hidden input に同期
  useEffect(() => {
    if (!hiddenInputRef.current) return;
    const dt = new DataTransfer();
    files.forEach((f) => dt.items.add(f));
    hiddenInputRef.current.files = dt.files;
  }, [files]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []);

    const oversized = selected.filter((f) => f.size > 10 * 1024 * 1024);
    if (oversized.length > 0) {
      alert(`1ファイルあたり10MB以下にしてください。\n（超過: ${oversized.map((f) => f.name).join(", ")}）`);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const allowed    = selected.filter((f) => ["image/jpeg", "image/png"].includes(f.type));
    const remaining  = Math.max(0, 10 - files.length);
    const toAdd      = allowed.slice(0, remaining);

    setFiles((prev) => [...prev, ...toAdd]);
    setPreviews((prev) => [
      ...prev,
      ...toAdd.map((f) => ({ url: URL.createObjectURL(f), name: f.name })),
    ]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  const atLimit = files.length >= 10;

  return (
    <form action={formAction} className="space-y-6">
      {state?.error && <Alert variant="danger">{state.error}</Alert>}

      {/* 作業日時 */}
      <div>
        <label className="block text-xs font-medium text-muted mb-1.5">
          作業日時 <span className="text-danger">*</span>
        </label>
        <Input
          name="worked_at"
          type="datetime-local"
          required
          className="max-w-xs"
        />
      </div>

      {/* 作業内容 */}
      <div>
        <label className="block text-xs font-medium text-muted mb-1.5">
          作業内容 <span className="text-danger">*</span>
        </label>
        <Textarea
          name="content"
          rows={8}
          required
          placeholder={"実施した作業内容を詳しく記述してください。\n例：エアコンフィルターの清掃、冷媒補充..."}
        />
      </div>

      {/* 写真アップロード */}
      <div>
        <label className="block text-xs font-medium text-muted mb-1.5">
          写真（最大10枚・JPEG/PNG・1枚10MB以下）
        </label>

        {/* hidden input（フォーム送信用） */}
        <input
          ref={hiddenInputRef}
          type="file"
          name="photos"
          multiple
          accept="image/jpeg,image/png"
          className="hidden"
        />

        {/* プレビュー */}
        {previews.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-3">
            {previews.map((p, i) => (
              <div key={p.url} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.url}
                  alt={p.name}
                  className="w-20 h-20 object-cover rounded border border-border"
                />
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  title="削除"
                  style={{
                    position:        "absolute",
                    top:             "-8px",
                    right:           "-8px",
                    width:           "20px",
                    height:          "20px",
                    borderRadius:    "50%",
                    display:         "flex",
                    alignItems:      "center",
                    justifyContent:  "center",
                    fontSize:        "12px",
                    backgroundColor: "#ef4444",
                    color:           "#fff",
                    border:          "none",
                    cursor:          "pointer",
                  } as React.CSSProperties}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ファイル選択ボタン */}
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
            backgroundColor: atLimit ? "#f5f5f5" : "#ffffff",
            color:           atLimit ? "#aaa"    : "#1a1a1a",
            cursor:          atLimit ? "not-allowed" : "pointer",
          } as React.CSSProperties}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          写真を選択
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png"
            onChange={handleFileChange}
            disabled={atLimit}
            className="hidden"
          />
        </label>
        {atLimit && (
          <p className="mt-1 text-xs text-muted">上限（10枚）に達しています</p>
        )}
        {files.length > 0 && !atLimit && (
          <p className="mt-1 text-xs text-muted">{files.length} / 10 枚選択中</p>
        )}
      </div>

      {/* 送信ボタン */}
      <div className="pt-2 border-t border-border flex justify-end">
        <button
          type="submit"
          disabled={pending}
          style={{
            height:          "44px",
            padding:         "0 24px",
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
          {pending ? "送信中..." : "作業報告を送信する"}
        </button>
      </div>
    </form>
  );
}
