"use client";

import { useActionState, useState, useRef, useEffect } from "react";
import { Input }    from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert }    from "@/components/ui/alert";
import { updateReport, type ActionResult } from "../../../actions";

type Props = {
  reportId:          string;
  orderId:           string;
  defaultWorkedAt:   string;
  defaultContent:    string;
  existingPhotoUrls: string[];
};

export function EditReportForm({
  reportId,
  orderId,
  defaultWorkedAt,
  defaultContent,
  existingPhotoUrls,
}: Props) {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(
    updateReport,
    null
  );

  // existing photos the user wants to keep
  const [keepPhotos, setKeepPhotos] = useState<string[]>(existingPhotoUrls);

  // new photos to upload
  const [newPreviews, setNewPreviews] = useState<{ url: string; name: string }[]>([]);
  const [newFiles,    setNewFiles]    = useState<File[]>([]);
  const fileInputRef   = useRef<HTMLInputElement>(null);
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!hiddenInputRef.current) return;
    const dt = new DataTransfer();
    newFiles.forEach((f) => dt.items.add(f));
    hiddenInputRef.current.files = dt.files;
  }, [newFiles]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []);

    const oversized = selected.filter((f) => f.size > 10 * 1024 * 1024);
    if (oversized.length > 0) {
      alert(`1ファイルあたり10MB以下にしてください。\n（超過: ${oversized.map((f) => f.name).join(", ")}）`);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const allowed   = selected.filter((f) => ["image/jpeg", "image/png"].includes(f.type));
    const total     = keepPhotos.length + newFiles.length;
    const remaining = Math.max(0, 10 - total);
    const toAdd     = allowed.slice(0, remaining);

    setNewFiles((prev) => [...prev, ...toAdd]);
    setNewPreviews((prev) => [
      ...prev,
      ...toAdd.map((f) => ({ url: URL.createObjectURL(f), name: f.name })),
    ]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeExisting(url: string) {
    setKeepPhotos((prev) => prev.filter((u) => u !== url));
  }

  function removeNew(index: number) {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
    setNewPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  const totalPhotos = keepPhotos.length + newFiles.length;
  const atLimit = totalPhotos >= 10;

  return (
    <form action={formAction} className="space-y-6">
      {state?.error && <Alert variant="danger">{state.error}</Alert>}

      {/* hidden fields */}
      <input type="hidden" name="reportId" value={reportId} />
      <input type="hidden" name="orderId"  value={orderId}  />

      {/* keepPhotos: one hidden input per URL to retain */}
      {keepPhotos.map((url) => (
        <input key={url} type="hidden" name="keepPhotos" value={url} />
      ))}

      {/* 作業日時 */}
      <div>
        <label className="block text-xs font-medium text-muted mb-1.5">
          作業日時 <span className="text-danger">*</span>
        </label>
        <Input
          name="worked_at"
          type="datetime-local"
          defaultValue={defaultWorkedAt}
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
          defaultValue={defaultContent}
        />
      </div>

      {/* 写真 */}
      <div>
        <label className="block text-xs font-medium text-muted mb-1.5">
          写真（最大10枚・JPEG/PNG・1枚10MB以下）
        </label>

        {/* hidden input for new files */}
        <input
          ref={hiddenInputRef}
          type="file"
          name="photos"
          multiple
          accept="image/jpeg,image/png"
          className="hidden"
        />

        {/* existing photo previews */}
        {keepPhotos.length > 0 && (
          <div className="mb-2">
            <p className="text-xs text-muted mb-1.5">既存の写真</p>
            <div className="flex flex-wrap gap-3">
              {keepPhotos.map((url, i) => (
                <div key={url} className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={`既存写真 ${i + 1}`}
                    className="w-20 h-20 object-cover rounded border border-border"
                  />
                  <button
                    type="button"
                    onClick={() => removeExisting(url)}
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
          </div>
        )}

        {/* new photo previews */}
        {newPreviews.length > 0 && (
          <div className="mb-2">
            <p className="text-xs text-muted mb-1.5">新規追加</p>
            <div className="flex flex-wrap gap-3">
              {newPreviews.map((p, i) => (
                <div key={p.url} className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.url}
                    alt={p.name}
                    className="w-20 h-20 object-cover rounded border border-border"
                  />
                  <button
                    type="button"
                    onClick={() => removeNew(i)}
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
          </div>
        )}

        {/* file picker */}
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
          写真を追加
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
        {totalPhotos > 0 && !atLimit && (
          <p className="mt-1 text-xs text-muted">{totalPhotos} / 10 枚</p>
        )}
      </div>

      {/* 送信ボタン */}
      <div className="pt-2 border-t border-border flex justify-end gap-3">
        <a
          href={`/contractor/orders/${orderId}`}
          style={{
            display:         "inline-flex",
            alignItems:      "center",
            height:          "44px",
            padding:         "0 20px",
            borderRadius:    "4px",
            fontSize:        "14px",
            fontWeight:      500,
            backgroundColor: "#F5F5F5",
            color:           "#1A1A1A",
            border:          "1px solid #E0E0E0",
            textDecoration:  "none",
          } as React.CSSProperties}
        >
          キャンセル
        </a>
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
          {pending ? "保存中..." : "変更を保存する"}
        </button>
      </div>
    </form>
  );
}
