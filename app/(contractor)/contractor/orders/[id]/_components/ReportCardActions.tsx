"use client";

import Link from "next/link";
import { useActionState } from "react";
import { deleteReport, type ActionResult } from "../report/actions";

type Props = {
  reportId: string;
  orderId:  string;
};

export function ReportCardActions({ reportId, orderId }: Props) {
  const [, formAction, pending] = useActionState<ActionResult | null, FormData>(
    deleteReport,
    null
  );

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (!window.confirm("この作業報告を削除してよろしいですか？")) {
      e.preventDefault();
    }
  }

  return (
    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
      <Link
        href={`/contractor/orders/${orderId}/report/${reportId}/edit`}
        style={{
          display:         "inline-flex",
          alignItems:      "center",
          height:          "30px",
          padding:         "0 12px",
          borderRadius:    "4px",
          fontSize:        "12px",
          fontWeight:      500,
          backgroundColor: "#F5F5F5",
          color:           "#1A1A1A",
          border:          "1px solid #E0E0E0",
          textDecoration:  "none",
          whiteSpace:      "nowrap",
        } as React.CSSProperties}
      >
        編集
      </Link>

      <form action={formAction} onSubmit={handleSubmit}>
        <input type="hidden" name="reportId" value={reportId} />
        <input type="hidden" name="orderId"  value={orderId}  />
        <button
          type="submit"
          disabled={pending}
          style={{
            display:         "inline-flex",
            alignItems:      "center",
            height:          "30px",
            padding:         "0 12px",
            borderRadius:    "4px",
            fontSize:        "12px",
            fontWeight:      500,
            backgroundColor: "#FEE2E2",
            color:           "#991B1B",
            border:          "1px solid #FCA5A5",
            cursor:          pending ? "not-allowed" : "pointer",
            opacity:         pending ? 0.6 : 1,
            whiteSpace:      "nowrap",
          } as React.CSSProperties}
        >
          {pending ? "削除中..." : "削除"}
        </button>
      </form>
    </div>
  );
}
