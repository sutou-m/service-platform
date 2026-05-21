"use client";

import { useActionState } from "react";
import { useFormStatus }  from "react-dom";
import { updateContractorStatus } from "../actions";
import { Badge }  from "@/components/ui/badge";
import { Alert }  from "@/components/ui/alert";

type ActionResult = { error?: string; success?: boolean };

const STATUS_OPTIONS = [
  { value: "ACTIVE",   label: "稼働中" },
  { value: "INACTIVE", label: "停止中" },
] as const;

function SubmitButton({ label, isPrimary }: { label: string; isPrimary: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      style={{
        display:         "inline-flex",
        alignItems:      "center",
        height:          "36px",
        padding:         "0 16px",
        borderRadius:    "4px",
        fontSize:        "13px",
        fontWeight:      500,
        cursor:          pending ? "not-allowed" : "pointer",
        opacity:         pending ? 0.6 : 1,
        backgroundColor: isPrimary ? "#1a1a1a" : "#ffffff",
        color:           isPrimary ? "#ffffff" : "#1a1a1a",
        border:          isPrimary ? "none" : "1px solid #e0e0e0",
        whiteSpace:      "nowrap",
      }}
    >
      {pending ? "更新中..." : label}
    </button>
  );
}

export function ContractorStatusChanger({
  contractorId,
  currentStatus,
}: {
  contractorId:  string;
  currentStatus: string;
}) {
  const [state, formAction] = useActionState<ActionResult | null, FormData>(
    updateContractorStatus,
    null
  );

  const badgeVariant =
    currentStatus === "ACTIVE" ? "success" :
    currentStatus === "INACTIVE" ? "default" : "warning";

  const nextStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
  const nextLabel  = currentStatus === "ACTIVE" ? "停止する" : "稼働に戻す";

  return (
    <div className="rounded-lg border border-border bg-surface p-5 space-y-3">
      <h2 className="text-sm font-semibold text-foreground">ステータス</h2>

      <div className="flex items-center gap-2">
        <Badge variant={badgeVariant}>
          {STATUS_OPTIONS.find((s) => s.value === currentStatus)?.label ?? currentStatus}
        </Badge>
      </div>

      {state?.error && <Alert variant="danger">{state.error}</Alert>}

      {currentStatus !== "PENDING" && (
        <form action={formAction}>
          <input type="hidden" name="contractorId" value={contractorId} />
          <input type="hidden" name="status"       value={nextStatus} />
          <SubmitButton label={nextLabel} isPrimary={nextStatus === "ACTIVE"} />
        </form>
      )}
    </div>
  );
}
