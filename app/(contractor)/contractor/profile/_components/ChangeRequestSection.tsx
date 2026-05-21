"use client";

import { useActionState, useState, useEffect } from "react";
import { Modal }    from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { Alert }    from "@/components/ui/alert";
import { submitChangeRequest, type ActionResult } from "../actions";

/* ─────────────────────────────────────────────
   Inner form — mounted fresh each time the modal opens
   so useActionState state resets on reopen
───────────────────────────────────────────── */
function ChangeRequestForm({ onSuccess }: { onSuccess: () => void }) {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(
    submitChangeRequest,
    null
  );

  useEffect(() => {
    if (state?.success) onSuccess();
  }, [state?.success, onSuccess]);

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && <Alert variant="danger">{state.error}</Alert>}

      <div>
        <label className="block text-xs font-medium text-muted mb-1.5">
          変更内容 <span className="text-danger">*</span>
        </label>
        <Textarea
          name="message"
          rows={6}
          required
          placeholder={`変更したい項目と新しい内容を記載してください。\n例：住所を「東京都渋谷区○○1-2-3」に変更したい`}
        />
        <p className="mt-1 text-xs text-muted">最大1000文字</p>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          /* NOTE: handled by Modal's onClose passed from parent */
          onClick={() => (document.activeElement as HTMLElement)?.closest("dialog")?.close()}
          style={{
            height:          "40px",
            padding:         "0 16px",
            borderRadius:    "4px",
            fontSize:        "13px",
            fontWeight:      500,
            backgroundColor: "#F5F5F5",
            color:           "#1A1A1A",
            border:          "1px solid #E0E0E0",
            cursor:          "pointer",
          } as React.CSSProperties}
        >
          キャンセル
        </button>
        <button
          type="submit"
          disabled={pending}
          style={{
            height:          "40px",
            padding:         "0 20px",
            borderRadius:    "4px",
            fontSize:        "13px",
            fontWeight:      600,
            backgroundColor: "#1a1a1a",
            color:           "#ffffff",
            border:          "none",
            cursor:          pending ? "not-allowed" : "pointer",
            opacity:         pending ? 0.6 : 1,
          } as React.CSSProperties}
        >
          {pending ? "送信中..." : "申請を送信する"}
        </button>
      </div>
    </form>
  );
}

/* ─────────────────────────────────────────────
   Toast
───────────────────────────────────────────── */
function Toast({ visible }: { visible: boolean }) {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position:        "fixed",
        top:             "20px",
        left:            "50%",
        transform:       "translateX(-50%)",
        zIndex:          9999,
        display:         "flex",
        alignItems:      "center",
        gap:             "8px",
        padding:         "12px 20px",
        borderRadius:    "8px",
        backgroundColor: "#D1FAE5",
        color:           "#065F46",
        border:          "1px solid #6EE7B7",
        fontSize:        "13px",
        fontWeight:      500,
        boxShadow:       "0 4px 16px rgba(0,0,0,0.12)",
        whiteSpace:      "nowrap",
        transition:      "opacity 0.3s ease, transform 0.3s ease",
        opacity:         visible ? 1 : 0,
        pointerEvents:   "none",
      } as React.CSSProperties}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
        <polyline points="20 6 9 17 4 12" />
      </svg>
      申請を受け付けました。管理者が確認次第ご連絡します。
    </div>
  );
}

/* ─────────────────────────────────────────────
   Section (outer)
───────────────────────────────────────────── */
export function ChangeRequestSection() {
  const [open,         setOpen]         = useState(false);
  const [toastStage,   setToastStage]   = useState<"hidden" | "visible" | "hiding">("hidden");

  function showToast() {
    setToastStage("visible");
    setTimeout(() => setToastStage("hiding"),  3000);
    setTimeout(() => setToastStage("hidden"),  3300);
  }

  function handleSuccess() {
    setOpen(false);
    showToast();
  }

  return (
    <>
      <Toast visible={toastStage === "visible"} />

      <div className="rounded-lg border border-border bg-surface p-5">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-sm font-semibold text-foreground">登録情報の変更申請</p>
            <p className="text-xs text-muted mt-0.5">
              会社名・住所・電話番号など登録情報の変更は管理者が対応します
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            style={{
              display:         "inline-flex",
              alignItems:      "center",
              gap:             "6px",
              height:          "40px",
              padding:         "0 18px",
              borderRadius:    "4px",
              fontSize:        "13px",
              fontWeight:      600,
              backgroundColor: "#1a1a1a",
              color:           "#ffffff",
              border:          "none",
              cursor:          "pointer",
              whiteSpace:      "nowrap",
            } as React.CSSProperties}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z" />
            </svg>
            情報変更を申請する
          </button>
        </div>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="情報変更申請"
      >
        {/* Mount fresh form each time modal opens so state resets */}
        {open && <ChangeRequestForm onSuccess={handleSuccess} />}
      </Modal>
    </>
  );
}
