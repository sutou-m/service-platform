"use client";

import { useActionState, useState } from "react";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { updateNotifyEmail, type ActionResult } from "../actions";

export function NotifySettingsPanel({ currentEmail }: { currentEmail: string }) {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(
    updateNotifyEmail,
    null
  );
  const [email, setEmail] = useState(currentEmail);

  return (
    <div>
      <h2 className="text-sm font-semibold text-ink mb-3">メール通知設定</h2>
      <div className="border border-border rounded p-4 max-w-lg">
        {state?.error   && <Alert variant="danger"   className="mb-4">{state.error}</Alert>}
        {state?.success && <Alert variant="success"  className="mb-4">保存しました</Alert>}

        <form action={formAction} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">
              通知先メールアドレス <span className="text-danger">*</span>
            </label>
            <Input
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
            />
            <p className="mt-1 text-xs text-muted">
              問い合わせ・申請・承認時の通知メールがこのアドレスに送信されます。
            </p>
          </div>
          <div className="flex justify-end">
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
          </div>
        </form>
      </div>
    </div>
  );
}
