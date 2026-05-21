"use client";

import { useActionState, useState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { updateOrderField } from "../actions";
import { Label }    from "@/components/ui/label";
import { Input }    from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button }   from "@/components/ui/button";
import { Alert }    from "@/components/ui/alert";

type ActionResult = { error?: string; success?: boolean };

/** ISO 文字列を datetime-local input の値形式に変換 */
function toDatetimeLocal(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, "0");
  return (
    `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}` +
    `T${p(d.getHours())}:${p(d.getMinutes())}`
  );
}

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

function Feedback({ state }: { state: ActionResult | null }) {
  if (!state) return null;
  if (state.error)   return <Alert variant="danger"  className="mt-2">{state.error}</Alert>;
  if (state.success) return <Alert variant="success" className="mt-2">保存しました</Alert>;
  return null;
}

type Props = {
  orderId:      string;
  visitAt:      string | null;
  workAt:       string | null;
  internalMemo: string | null;
};

export function OrderFieldsEditor({ orderId, visitAt, workAt, internalMemo }: Props) {
  // 各フィールドの controlled state（React 19 のフォーム自動リセット対策）
  const [visitVal, setVisitVal] = useState(toDatetimeLocal(visitAt));
  const [workVal,  setWorkVal]  = useState(toDatetimeLocal(workAt));
  const [memoVal,  setMemoVal]  = useState(internalMemo ?? "");

  // サーバー再レンダリング後に props が更新されたら同期
  useEffect(() => { setVisitVal(toDatetimeLocal(visitAt)); }, [visitAt]);
  useEffect(() => { setWorkVal(toDatetimeLocal(workAt));   }, [workAt]);
  useEffect(() => { setMemoVal(internalMemo ?? "");        }, [internalMemo]);

  const [visitState, visitAction] = useActionState<ActionResult | null, FormData>(updateOrderField, null);
  const [workState,  workAction]  = useActionState<ActionResult | null, FormData>(updateOrderField, null);
  const [memoState,  memoAction]  = useActionState<ActionResult | null, FormData>(updateOrderField, null);

  return (
    <div className="space-y-5 pt-4 border-t border-border">
      {/* 訪問予定日時 */}
      <div>
        <Label htmlFor="visitAt">訪問予定日時</Label>
        <form action={visitAction} className="mt-1 flex gap-2">
          <input type="hidden" name="orderId" value={orderId} />
          <input type="hidden" name="field"   value="visit_at" />
          <Input
            id="visitAt"
            type="datetime-local"
            name="value"
            value={visitVal}
            onChange={(e) => setVisitVal(e.target.value)}
            className="flex-1"
          />
          <SaveButton />
        </form>
        <Feedback state={visitState} />
      </div>

      {/* 作業予定日時 */}
      <div>
        <Label htmlFor="workAt">作業予定日時</Label>
        <form action={workAction} className="mt-1 flex gap-2">
          <input type="hidden" name="orderId" value={orderId} />
          <input type="hidden" name="field"   value="work_at" />
          <Input
            id="workAt"
            type="datetime-local"
            name="value"
            value={workVal}
            onChange={(e) => setWorkVal(e.target.value)}
            className="flex-1"
          />
          <SaveButton />
        </form>
        <Feedback state={workState} />
      </div>

      {/* 内部メモ */}
      <div>
        <Label htmlFor="internalMemo">内部メモ</Label>
        <form action={memoAction} className="mt-1 space-y-2">
          <input type="hidden" name="orderId" value={orderId} />
          <input type="hidden" name="field"   value="internal_memo" />
          <Textarea
            id="internalMemo"
            name="value"
            rows={4}
            value={memoVal}
            onChange={(e) => setMemoVal(e.target.value)}
            placeholder="担当者向けの備考など"
          />
          <div className="flex justify-end">
            <SaveButton />
          </div>
        </form>
        <Feedback state={memoState} />
      </div>
    </div>
  );
}
