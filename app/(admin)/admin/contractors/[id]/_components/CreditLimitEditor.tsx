"use client";

import { useActionState, useState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { updateCreditLimit } from "../actions";
import { Input }  from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert }  from "@/components/ui/alert";
import { Label }  from "@/components/ui/label";

type ActionResult = { error?: string; success?: boolean };

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" loading={pending} disabled={pending}>
      保存
    </Button>
  );
}

export function CreditLimitEditor({
  contractorId,
  creditBalance,
  creditLimit,
}: {
  contractorId:  string;
  creditBalance: number;
  creditLimit:   number;
}) {
  const [state, formAction] = useActionState<ActionResult | null, FormData>(
    updateCreditLimit,
    null
  );
  const [limitVal, setLimitVal] = useState(String(creditLimit));

  useEffect(() => { setLimitVal(String(creditLimit)); }, [creditLimit]);

  return (
    <div className="rounded-lg border border-border bg-surface p-5 space-y-4">
      <h2 className="text-sm font-semibold text-foreground">クレジット管理</h2>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-md bg-accent p-3">
          <p className="text-xs text-muted mb-1">使用済み</p>
          <p className="text-lg font-bold tabular-nums text-foreground">
            ¥{creditBalance.toLocaleString("ja-JP")}
          </p>
        </div>
        <div className="rounded-md bg-accent p-3">
          <p className="text-xs text-muted mb-1">上限</p>
          <p className="text-lg font-bold tabular-nums text-foreground">
            ¥{creditLimit.toLocaleString("ja-JP")}
          </p>
        </div>
      </div>

      {state?.error   && <Alert variant="danger">{state.error}</Alert>}
      {state?.success && <Alert variant="success">保存しました</Alert>}

      <form action={formAction} className="space-y-2">
        <input type="hidden" name="contractorId" value={contractorId} />
        <Label htmlFor="credit-limit">クレジット上限（円）</Label>
        <div className="flex gap-2">
          <Input
            id="credit-limit"
            name="creditLimit"
            type="number"
            min={0}
            step={1000}
            value={limitVal}
            onChange={(e) => setLimitVal(e.target.value)}
            className="flex-1"
          />
          <SaveButton />
        </div>
      </form>
    </div>
  );
}
