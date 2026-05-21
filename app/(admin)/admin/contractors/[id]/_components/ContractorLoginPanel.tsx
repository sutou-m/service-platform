"use client";

import { useActionState } from "react";
import { Input }  from "@/components/ui/input";
import { Alert }  from "@/components/ui/alert";
import {
  issueContractorLogin,
  resetContractorPassword,
  unlinkContractorLogin,
  type ActionResult,
} from "../actions";

type LinkedUser = { id: string; email: string };

export function ContractorLoginPanel({
  contractorId,
  linkedUser,
}: {
  contractorId: string;
  linkedUser:   LinkedUser | null;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface p-5 space-y-4">
      <h2 className="text-sm font-semibold text-foreground">ログインアカウント</h2>

      {linkedUser ? (
        <LinkedPanel contractorId={contractorId} user={linkedUser} />
      ) : (
        <IssuePanel contractorId={contractorId} />
      )}
    </div>
  );
}

/* ── アカウント未設定：新規発行 ── */
function IssuePanel({ contractorId }: { contractorId: string }) {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(
    issueContractorLogin,
    null
  );

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted">ログインアカウントが設定されていません。</p>

      {state?.error   && <Alert variant="danger">{state.error}</Alert>}
      {state?.success && <Alert variant="success">アカウントを発行しました</Alert>}

      <form action={formAction} className="space-y-3">
        <input type="hidden" name="contractorId" value={contractorId} />
        <div>
          <label className="block text-xs font-medium text-muted mb-1">
            メールアドレス <span className="text-danger">*</span>
          </label>
          <Input name="email" type="email" placeholder="contractor@example.com" required />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted mb-1">
            パスワード <span className="text-danger">*</span>
          </label>
          <Input name="password" type="password" placeholder="8文字以上" required />
        </div>
        <button
          type="submit"
          disabled={pending}
          style={{
            width:           "100%",
            height:          "40px",
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
          {pending ? "発行中..." : "アカウントを発行"}
        </button>
      </form>
    </div>
  );
}

/* ── アカウント設定済み：パスワードリセット・解除 ── */
function LinkedPanel({ contractorId, user }: { contractorId: string; user: LinkedUser }) {
  const [resetState, resetAction, resetPending] = useActionState<ActionResult | null, FormData>(
    resetContractorPassword,
    null
  );
  const [unlinkState, unlinkAction, unlinkPending] = useActionState<ActionResult | null, FormData>(
    unlinkContractorLogin,
    null
  );

  return (
    <div className="space-y-4">
      {/* 現在のアカウント */}
      <div className="rounded bg-accent px-3 py-2">
        <p className="text-xs text-muted mb-0.5">登録メールアドレス</p>
        <p className="text-sm text-foreground font-medium">{user.email}</p>
      </div>

      {/* パスワードリセット */}
      <div>
        <p className="text-xs font-medium text-muted mb-2">パスワードをリセット</p>
        {resetState?.error   && <Alert variant="danger"   className="mb-2">{resetState.error}</Alert>}
        {resetState?.success && <Alert variant="success"  className="mb-2">パスワードを更新しました</Alert>}
        <form action={resetAction} className="flex gap-2">
          <input type="hidden" name="contractorId" value={contractorId} />
          <input type="hidden" name="userId"       value={user.id} />
          <Input name="password" type="password" placeholder="新しいパスワード（8文字以上）" required />
          <button
            type="submit"
            disabled={resetPending}
            style={{
              height:          "40px",
              padding:         "0 12px",
              borderRadius:    "4px",
              fontSize:        "13px",
              fontWeight:      500,
              cursor:          resetPending ? "not-allowed" : "pointer",
              backgroundColor: "#1a1a1a",
              color:           "#ffffff",
              border:          "none",
              opacity:         resetPending ? 0.6 : 1,
              whiteSpace:      "nowrap",
            } as React.CSSProperties}
          >
            更新
          </button>
        </form>
      </div>

      {/* 解除 */}
      {unlinkState?.error && <Alert variant="danger">{unlinkState.error}</Alert>}
      <form action={unlinkAction}>
        <input type="hidden" name="contractorId" value={contractorId} />
        <input type="hidden" name="userId"       value={user.id} />
        <button
          type="submit"
          disabled={unlinkPending}
          onClick={(e) => {
            if (!window.confirm("ログインアカウントを削除しますか？この操作は取り消せません。")) {
              e.preventDefault();
            }
          }}
          style={{
            height:          "36px",
            padding:         "0 12px",
            borderRadius:    "4px",
            fontSize:        "13px",
            cursor:          unlinkPending ? "not-allowed" : "pointer",
            backgroundColor: "#FEE2E2",
            color:           "#991B1B",
            border:          "1px solid #FCA5A5",
            opacity:         unlinkPending ? 0.6 : 1,
          } as React.CSSProperties}
        >
          アカウントを削除
        </button>
      </form>
    </div>
  );
}
