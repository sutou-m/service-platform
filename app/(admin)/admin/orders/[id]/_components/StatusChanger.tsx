"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { changeStatus } from "../actions";
import { Select }  from "@/components/ui/select";
import { Button }  from "@/components/ui/button";
import { Alert }   from "@/components/ui/alert";

const ORDER_STATUSES = [
  { value: "NEW",               label: "新規" },
  { value: "VISIT_SCHEDULING",  label: "訪問調整中" },
  { value: "WORK_SCHEDULED",    label: "作業予定" },
  { value: "WORKING",           label: "作業中" },
  { value: "WORK_DONE",         label: "作業完了" },
  { value: "INVOICED",          label: "請求済" },
  { value: "PAID",              label: "入金済" },
  { value: "CLOSED",            label: "クローズ" },
] as const;

function ApplyButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" variant="secondary" loading={pending} disabled={pending}>
      変更する
    </Button>
  );
}

export function StatusChanger({
  orderId,
  currentStatus,
}: {
  orderId:       string;
  currentStatus: string;
}) {
  const [state, formAction] = useActionState(changeStatus, null);

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">ステータス変更</h3>
      {state?.error   && <Alert variant="danger">{state.error}</Alert>}
      {state?.success && <Alert variant="success">ステータスを更新しました</Alert>}

      <form action={formAction} className="flex gap-2 items-end">
        <input type="hidden" name="orderId" value={orderId} />
        <Select name="status" defaultValue={currentStatus} className="flex-1">
          {ORDER_STATUSES.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </Select>
        <ApplyButton />
      </form>
    </div>
  );
}
