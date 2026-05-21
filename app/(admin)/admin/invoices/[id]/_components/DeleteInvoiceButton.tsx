"use client";

import { useActionState } from "react";
import { useFormStatus }  from "react-dom";
import { deleteInvoice }  from "../actions";
import { Alert }          from "@/components/ui/alert";

type ActionResult = { error?: string; success?: boolean };

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      style={{
        display:         "inline-flex",
        alignItems:      "center",
        justifyContent:  "center",
        width:           "100%",
        height:          "40px",
        padding:         "0 16px",
        borderRadius:    "4px",
        fontSize:        "14px",
        fontWeight:      500,
        cursor:          pending ? "not-allowed" : "pointer",
        backgroundColor: "#FEE2E2",
        color:           "#991B1B",
        border:          "1px solid #FCA5A5",
        opacity:         pending ? 0.6 : 1,
      } as React.CSSProperties}
    >
      {pending ? "削除中..." : "請求書を削除"}
    </button>
  );
}

export function DeleteInvoiceButton({ invoiceId }: { invoiceId: string }) {
  const [state, formAction] = useActionState<ActionResult | null, FormData>(deleteInvoice, null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (!window.confirm(
      "この請求書を削除しますか？関連する明細・入金情報もすべて削除されます。この操作は取り消せません。"
    )) {
      e.preventDefault();
    }
  }

  return (
    <div>
      {state?.error && <Alert variant="danger" className="mb-2">{state.error}</Alert>}
      <form action={formAction} onSubmit={handleSubmit}>
        <input type="hidden" name="invoiceId" value={invoiceId} />
        <SubmitBtn />
      </form>
    </div>
  );
}
