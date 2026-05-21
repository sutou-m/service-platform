"use client";

import { useActionState } from "react";
import { useFormStatus }  from "react-dom";
import { approveContractor, rejectContractor } from "../../actions";
import { Alert } from "@/components/ui/alert";

type ActionResult = { error?: string };

const btnBase: React.CSSProperties = {
  display:        "inline-flex",
  alignItems:     "center",
  justifyContent: "center",
  width:          "100%",
  height:         "44px",
  padding:        "0 16px",
  borderRadius:   "4px",
  fontSize:       "14px",
  fontWeight:     600,
  cursor:         "pointer",
  border:         "none",
  whiteSpace:     "nowrap",
};

function ApproveSubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      style={{ ...btnBase, backgroundColor: "#1a1a1a", color: "#ffffff", opacity: pending ? 0.6 : 1 }}
    >
      {pending ? "処理中..." : "承認する"}
    </button>
  );
}

function RejectSubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      style={{
        ...btnBase,
        backgroundColor: "#ffffff",
        color:           "#1a1a1a",
        border:          "1px solid #e0e0e0",
        opacity:         pending ? 0.6 : 1,
      }}
      onMouseEnter={(e) => { if (!pending) e.currentTarget.style.backgroundColor = "#f5f5f5"; }}
      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#ffffff"; }}
    >
      {pending ? "処理中..." : "却下する"}
    </button>
  );
}

export function ApplicationActions({ contractorId }: { contractorId: string }) {
  const [approveState, approveAction] = useActionState<ActionResult | null, FormData>(
    approveContractor,
    null
  );
  const [rejectState, rejectAction] = useActionState<ActionResult | null, FormData>(
    rejectContractor,
    null
  );

  const error = approveState?.error ?? rejectState?.error;

  return (
    <div className="rounded-lg border border-border bg-surface p-5 space-y-3">
      <h2 className="text-sm font-semibold text-foreground">審査</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <form
        action={approveAction}
        onSubmit={(e) => {
          if (!window.confirm("この業者を承認しますか？承認するとACTIVEになります。")) {
            e.preventDefault();
          }
        }}
      >
        <input type="hidden" name="contractorId" value={contractorId} />
        <ApproveSubmitBtn />
      </form>

      <form
        action={rejectAction}
        onSubmit={(e) => {
          if (!window.confirm("この申請を却下しますか？")) {
            e.preventDefault();
          }
        }}
      >
        <input type="hidden" name="contractorId" value={contractorId} />
        <RejectSubmitBtn />
      </form>
    </div>
  );
}
