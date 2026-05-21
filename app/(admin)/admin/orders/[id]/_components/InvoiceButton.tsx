"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus }  from "react-dom";
import { createInvoice }  from "../actions";
import { Alert } from "@/components/ui/alert";

type ActionResult = { error?: string; success?: boolean };

const btnStyle = {
  display:         "inline-flex",
  alignItems:      "center",
  justifyContent:  "center",
  width:           "100%",
  height:          "40px",
  padding:         "0 16px",
  borderRadius:    "4px",
  fontSize:        "14px",
  fontWeight:      500,
  cursor:          "pointer",
  border:          "none",
  backgroundColor: "#1a1a1a",
  color:           "#ffffff",
} as React.CSSProperties;

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}
      style={{ ...btnStyle, opacity: pending ? 0.6 : 1 }}
    >
      {pending ? "作成中..." : "請求書を発行する"}
    </button>
  );
}

export function InvoiceButton({
  orderId,
  existingInvoiceId,
}: {
  orderId:           string;
  existingInvoiceId: string | null;
}) {
  const [state, formAction] = useActionState<ActionResult | null, FormData>(createInvoice, null);

  if (existingInvoiceId) {
    return (
      <div>
        <p className="text-xs text-muted mb-2">請求書</p>
        <Link
          href={`/admin/invoices/${existingInvoiceId}`}
          className="inline-flex items-center justify-center w-full h-10 px-4 rounded text-sm font-medium transition-opacity hover:opacity-80"
          style={{ backgroundColor: "#f5f5f5", color: "#1a1a1a", border: "1px solid #e0e0e0" }}
        >
          請求書を確認する →
        </Link>
      </div>
    );
  }

  return (
    <div>
      {state?.error && <Alert variant="danger" className="mb-2">{state.error}</Alert>}
      <form action={formAction}>
        <input type="hidden" name="orderId" value={orderId} />
        <SubmitBtn />
      </form>
    </div>
  );
}
