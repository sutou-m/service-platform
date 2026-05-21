"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { convertToOrder, updateStatus } from "../actions";
import { Button } from "@/components/ui/button";
import { Alert }  from "@/components/ui/alert";

type Props = {
  inquiry: { id: string; status: string };
};

function SubmitButton({
  label,
  variant,
}: {
  label:    string;
  variant?: "primary" | "secondary" | "danger";
}) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant={variant ?? "primary"}
      size="sm"
      loading={pending}
      disabled={pending}
      className="w-full"
    >
      {label}
    </Button>
  );
}

export function InquiryActions({ inquiry }: Props) {
  const [convertState, convertAction] = useActionState(convertToOrder, null);
  const [statusState,  statusAction]  = useActionState(updateStatus, null);

  const isNew       = inquiry.status === "NEW";
  const isClosed    = inquiry.status === "CLOSED";
  const isConverted = inquiry.status === "CONVERTED";

  return (
    <div className="rounded-lg border border-border bg-surface p-5 space-y-4">
      <h2 className="text-sm font-semibold text-foreground">アクション</h2>

      {(convertState?.error || statusState?.error) && (
        <Alert variant="danger">
          {convertState?.error ?? statusState?.error}
        </Alert>
      )}
      {statusState?.success && (
        <Alert variant="success">ステータスを更新しました</Alert>
      )}

      {/* 案件に変換 */}
      <form action={convertAction}>
        <input type="hidden" name="inquiryId" value={inquiry.id} />
        {isNew ? (
          <SubmitButton label="案件に変換" />
        ) : (
          <Button type="button" size="sm" disabled className="w-full">
            {isConverted ? "案件化済み" : "案件に変換"}
          </Button>
        )}
      </form>

      {/* ステータス変更 */}
      <form action={statusAction}>
        <input type="hidden" name="inquiryId" value={inquiry.id} />
        {isClosed ? (
          <>
            <input type="hidden" name="status" value="NEW" />
            <SubmitButton label="再オープン" variant="secondary" />
          </>
        ) : (
          <>
            <input type="hidden" name="status" value="CLOSED" />
            <SubmitButton label="クローズ" variant="secondary" />
          </>
        )}
      </form>
    </div>
  );
}
