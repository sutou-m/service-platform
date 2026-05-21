"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { createOrder, type ActionResult } from "../actions";
import { Label }    from "@/components/ui/label";
import { Input }    from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select }   from "@/components/ui/select";
import { Button }   from "@/components/ui/button";
import { Alert }    from "@/components/ui/alert";

type Customer    = { id: string; name: string; phone: string };
type Contractor  = { id: string; company_name: string };

type Props = {
  customers:   Customer[];
  contractors: Contractor[];
};

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return <p className="mt-1 text-xs text-danger">{messages[0]}</p>;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" loading={pending} disabled={pending} className="w-full">
      {pending ? "保存中..." : "案件を登録する"}
    </Button>
  );
}

export function OrderForm({ customers, contractors }: Props) {
  const [state, formAction] = useActionState<ActionResult | null, FormData>(createOrder, null);

  const [values, setValues] = useState({
    customerId:   "",
    workContent:  "",
    workAddress:  "",
    visitAt:      "",
    workAt:       "",
    contractorId: "",
    internalMemo: "",
  });

  const set = (field: keyof typeof values) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setValues((v) => ({ ...v, [field]: e.target.value }));

  return (
    <form action={formAction} className="space-y-6" noValidate>
      {state?._form && <Alert variant="danger">{state._form}</Alert>}

      {/* 顧客 */}
      <div>
        <Label htmlFor="customerId" required>顧客</Label>
        <div className="mt-1">
          <Select
            id="customerId"
            name="customerId"
            value={values.customerId}
            onChange={set("customerId")}
            error={!!state?.errors?.customerId}
          >
            <option value="">顧客を選択してください</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}（{c.phone}）
              </option>
            ))}
          </Select>
        </div>
        <FieldError messages={state?.errors?.customerId} />
      </div>

      {/* 作業内容 */}
      <div>
        <Label htmlFor="workContent" required>作業内容</Label>
        <div className="mt-1">
          <Textarea
            id="workContent"
            name="workContent"
            rows={3}
            placeholder="例：洗面所の蛇口交換"
            value={values.workContent}
            onChange={set("workContent")}
            error={!!state?.errors?.workContent}
          />
        </div>
        <FieldError messages={state?.errors?.workContent} />
      </div>

      {/* 作業場所 */}
      <div>
        <Label htmlFor="workAddress" required>作業場所</Label>
        <div className="mt-1">
          <Input
            id="workAddress"
            name="workAddress"
            type="text"
            placeholder="東京都渋谷区〇〇 1-2-3"
            value={values.workAddress}
            onChange={set("workAddress")}
            error={!!state?.errors?.workAddress}
          />
        </div>
        <FieldError messages={state?.errors?.workAddress} />
      </div>

      {/* 訪問予定日時 / 作業予定日時 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="visitAt">訪問予定日時</Label>
          <p className="mt-0.5 text-xs text-muted">任意</p>
          <div className="mt-1">
            <Input
              id="visitAt"
              name="visitAt"
              type="datetime-local"
              value={values.visitAt}
              onChange={set("visitAt")}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="workAt">作業予定日時</Label>
          <p className="mt-0.5 text-xs text-muted">任意</p>
          <div className="mt-1">
            <Input
              id="workAt"
              name="workAt"
              type="datetime-local"
              value={values.workAt}
              onChange={set("workAt")}
            />
          </div>
        </div>
      </div>

      {/* 担当業者 */}
      <div>
        <Label htmlFor="contractorId">担当業者</Label>
        <p className="mt-0.5 text-xs text-muted">任意</p>
        <div className="mt-1">
          <Select
            id="contractorId"
            name="contractorId"
            value={values.contractorId}
            onChange={set("contractorId")}
          >
            <option value="">未割当</option>
            {contractors.map((c) => (
              <option key={c.id} value={c.id}>{c.company_name}</option>
            ))}
          </Select>
        </div>
      </div>

      {/* 内部メモ */}
      <div>
        <Label htmlFor="internalMemo">内部メモ</Label>
        <p className="mt-0.5 text-xs text-muted">任意</p>
        <div className="mt-1">
          <Textarea
            id="internalMemo"
            name="internalMemo"
            rows={3}
            placeholder="担当者向けの備考など"
            value={values.internalMemo}
            onChange={set("internalMemo")}
          />
        </div>
      </div>

      <div className="pt-2">
        <SubmitButton />
      </div>
    </form>
  );
}
