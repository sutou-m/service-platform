"use client";

import { useActionState, useState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { updateDueDate } from "../actions";
import { Input }  from "@/components/ui/input";
import { Label }  from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert }  from "@/components/ui/alert";

type ActionResult = { error?: string; success?: boolean };

function SaveBtn() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" variant="secondary" loading={pending} disabled={pending}>
      保存
    </Button>
  );
}

function toDateInput(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toISOString().slice(0, 10);
}

export function DueDateEditor({
  invoiceId,
  dueDate,
}: {
  invoiceId: string;
  dueDate:   string | null;
}) {
  const [state, formAction] = useActionState<ActionResult | null, FormData>(updateDueDate, null);
  const [val, setVal] = useState(toDateInput(dueDate));

  useEffect(() => { setVal(toDateInput(dueDate)); }, [dueDate]);

  return (
    <div>
      {state?.error   && <Alert variant="danger"  className="mb-2">{state.error}</Alert>}
      {state?.success && <Alert variant="success" className="mb-2">保存しました</Alert>}
      <form action={formAction} className="flex gap-2 items-end">
        <input type="hidden" name="invoiceId" value={invoiceId} />
        <div className="flex-1">
          <Label htmlFor="due-date">支払期限</Label>
          <Input
            id="due-date"
            name="due_date"
            type="date"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            className="mt-1"
          />
        </div>
        <SaveBtn />
      </form>
    </div>
  );
}
