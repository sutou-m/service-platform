"use client";

import { useActionState, useState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { addPayment } from "../actions";
import { Input }    from "@/components/ui/input";
import { Label }    from "@/components/ui/label";
import { Button }   from "@/components/ui/button";
import { Alert }    from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";

type ActionResult = { error?: string; success?: boolean };
type Payment = {
  id:      string;
  amount:  number;
  paid_at: string;
  note:    string | null;
};

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" loading={pending} disabled={pending}>
      入金登録
    </Button>
  );
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export function PaymentForm({
  invoiceId,
  payments,
  totalAmount,
}: {
  invoiceId:   string;
  payments:    Payment[];
  totalAmount: number;
}) {
  const [state, formAction] = useActionState<ActionResult | null, FormData>(addPayment, null);
  const [amount, setAmount] = useState("");
  const [paidAt, setPaidAt] = useState(todayStr());
  const [note,   setNote]   = useState("");

  useEffect(() => {
    if (state?.success) { setAmount(""); setPaidAt(todayStr()); setNote(""); }
  }, [state]);

  const totalPaid    = payments.reduce((s, p) => s + p.amount, 0);
  const remaining    = totalAmount - totalPaid;

  return (
    <div className="space-y-5">
      {/* 入金サマリー */}
      <div className="rounded-lg border border-border bg-surface p-5">
        <h2 className="text-sm font-semibold text-foreground mb-3">入金状況</h2>
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between">
            <span className="text-muted">請求額</span>
            <span className="tabular-nums font-medium">¥{totalAmount.toLocaleString("ja-JP")}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">入金済</span>
            <span className="tabular-nums font-medium text-success">¥{totalPaid.toLocaleString("ja-JP")}</span>
          </div>
          <div className="flex justify-between border-t border-border pt-1.5 mt-1.5">
            <span className="text-muted font-medium">残高</span>
            <span
              className="tabular-nums font-bold"
              style={{ color: remaining > 0 ? "#ef4444" : "#059669" }}
            >
              ¥{remaining.toLocaleString("ja-JP")}
            </span>
          </div>
        </div>
      </div>

      {/* 入金登録フォーム */}
      <div className="rounded-lg border border-border bg-surface p-5">
        <h2 className="text-sm font-semibold text-foreground mb-4">入金登録</h2>
        {state?.error   && <Alert variant="danger"  className="mb-3">{state.error}</Alert>}
        {state?.success && <Alert variant="success" className="mb-3">登録しました</Alert>}
        <form action={formAction} className="space-y-3">
          <input type="hidden" name="invoiceId" value={invoiceId} />
          <div>
            <Label htmlFor="pay-amount">金額（円） *</Label>
            <Input
              id="pay-amount"
              name="amount"
              type="number"
              min={1}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1"
              required
            />
          </div>
          <div>
            <Label htmlFor="pay-date">入金日 *</Label>
            <Input
              id="pay-date"
              name="paid_at"
              type="date"
              value={paidAt}
              onChange={(e) => setPaidAt(e.target.value)}
              className="mt-1"
              required
            />
          </div>
          <div>
            <Label htmlFor="pay-note">メモ</Label>
            <Textarea
              id="pay-note"
              name="note"
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="振込口座・備考など"
              className="mt-1"
            />
          </div>
          <div className="flex justify-end">
            <SubmitBtn />
          </div>
        </form>
      </div>

      {/* 入金履歴 */}
      {payments.length > 0 && (
        <div className="rounded-lg border border-border bg-surface p-5">
          <h2 className="text-sm font-semibold text-foreground mb-3">入金履歴</h2>
          <div className="divide-y divide-border">
            {payments.map((p) => (
              <div key={p.id} className="py-2.5 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium tabular-nums text-foreground">
                    ¥{p.amount.toLocaleString("ja-JP")}
                  </p>
                  {p.note && (
                    <p className="text-xs text-muted mt-0.5 line-clamp-1">{p.note}</p>
                  )}
                </div>
                <span className="text-xs text-muted whitespace-nowrap shrink-0">
                  {new Date(p.paid_at).toLocaleDateString("ja-JP")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
