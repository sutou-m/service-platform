"use client";

import { useActionState, useState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { updateCustomerMemo } from "../actions";
import { Textarea } from "@/components/ui/textarea";
import { Button }   from "@/components/ui/button";
import { Alert }    from "@/components/ui/alert";

type ActionResult = { error?: string; success?: boolean };

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="secondary" size="sm" loading={pending} disabled={pending}>
      保存
    </Button>
  );
}

export function CustomerMemoForm({
  customerId,
  currentMemo,
}: {
  customerId:  string;
  currentMemo: string | null;
}) {
  const [state, formAction] = useActionState<ActionResult | null, FormData>(
    updateCustomerMemo,
    null
  );
  const [memo, setMemo] = useState(currentMemo ?? "");

  useEffect(() => { setMemo(currentMemo ?? ""); }, [currentMemo]);

  return (
    <div className="rounded-lg border border-border bg-surface p-5 space-y-3">
      <h2 className="text-sm font-semibold text-foreground">担当メモ</h2>

      {state?.error   && <Alert variant="danger">{state.error}</Alert>}
      {state?.success && <Alert variant="success">保存しました</Alert>}

      <form action={formAction} className="space-y-3">
        <input type="hidden" name="customerId" value={customerId} />
        <Textarea
          name="memo"
          rows={6}
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="顧客に関するメモを入力してください"
        />
        <div className="flex justify-end">
          <SaveButton />
        </div>
      </form>
    </div>
  );
}
