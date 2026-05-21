"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { assignContractor } from "../actions";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Alert }  from "@/components/ui/alert";

type Contractor = { id: string; company_name: string };

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" variant="secondary" loading={pending} disabled={pending}>
      保存
    </Button>
  );
}

export function AssignContractor({
  orderId,
  currentContractorId,
  contractors,
}: {
  orderId:             string;
  currentContractorId: string | null;
  contractors:         Contractor[];
}) {
  const [state, formAction] = useActionState(assignContractor, null);

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">担当業者</h3>
      {state?.error   && <Alert variant="danger">{state.error}</Alert>}
      {state?.success && <Alert variant="success">担当業者を更新しました</Alert>}

      <form action={formAction} className="flex gap-2 items-end">
        <input type="hidden" name="orderId" value={orderId} />
        <Select
          name="contractorId"
          defaultValue={currentContractorId ?? ""}
          className="flex-1"
        >
          <option value="">未割当</option>
          {contractors.map((c) => (
            <option key={c.id} value={c.id}>{c.company_name}</option>
          ))}
        </Select>
        <SaveButton />
      </form>
    </div>
  );
}
