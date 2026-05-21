"use client";

import { useActionState, useRef } from "react";
import { useFormStatus } from "react-dom";
import { updateMemo } from "../actions";
import { Textarea } from "@/components/ui/textarea";
import { Button }   from "@/components/ui/button";
import { Alert }    from "@/components/ui/alert";

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant="secondary"
      size="sm"
      loading={pending}
      disabled={pending}
    >
      保存
    </Button>
  );
}

export function MemoForm({
  inquiryId,
  currentMemo,
}: {
  inquiryId:   string;
  currentMemo: string | null;
}) {
  const [state, formAction] = useActionState(updateMemo, null);
  const ref = useRef<HTMLFormElement>(null);

  return (
    <div className="rounded-lg border border-border bg-surface p-5 space-y-3">
      <h2 className="text-sm font-semibold text-foreground">対応メモ</h2>

      {state?.error   && <Alert variant="danger">{state.error}</Alert>}
      {state?.success && <Alert variant="success">保存しました</Alert>}

      <form ref={ref} action={formAction} className="space-y-3">
        <input type="hidden" name="inquiryId" value={inquiryId} />
        <Textarea
          name="memo"
          rows={5}
          defaultValue={currentMemo ?? ""}
          placeholder="対応内容・連絡事項などを記入してください"
        />
        <div className="flex justify-end">
          <SaveButton />
        </div>
      </form>
    </div>
  );
}
