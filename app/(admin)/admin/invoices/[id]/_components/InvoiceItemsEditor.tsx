"use client";

import { useActionState, useState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { addInvoiceItem, updateInvoiceItem, deleteInvoiceItem } from "../actions";
import { Input }  from "@/components/ui/input";
import { Alert }  from "@/components/ui/alert";

type ActionResult = { error?: string; success?: boolean };

type Item = {
  id:          string;
  description: string;
  quantity:    number;
  unit_price:  number;
  amount:      number;  // tax-exclusive
  tax_rate:    number;
};

const TAX_RATES = [0, 8, 10] as const;

function taxAmt(excl: number, rate: number): number {
  return Math.floor(excl * rate / 100);
}

const selectStyle: React.CSSProperties = {
  height:          "36px",
  padding:         "0 8px",
  borderRadius:    "4px",
  border:          "1px solid #e0e0e0",
  fontSize:        "13px",
  backgroundColor: "#ffffff",
  cursor:          "pointer",
};

function AddSubmit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      style={{
        alignSelf:       "flex-end",
        height:          "36px",
        padding:         "0 16px",
        borderRadius:    "4px",
        fontSize:        "13px",
        fontWeight:      500,
        cursor:          pending ? "not-allowed" : "pointer",
        backgroundColor: "#1a1a1a",
        color:           "#ffffff",
        border:          "none",
        opacity:         pending ? 0.6 : 1,
        whiteSpace:      "nowrap",
      } as React.CSSProperties}
    >
      {pending ? "追加中…" : "追加"}
    </button>
  );
}

function ItemRow({ item, invoiceId }: { item: Item; invoiceId: string }) {
  const router = useRouter();
  const [editing,  setEditing]  = useState(false);
  const [desc,     setDesc]     = useState(item.description);
  const [qty,      setQty]      = useState(String(item.quantity));
  const [price,    setPrice]    = useState(String(item.unit_price));
  const [taxRate,  setTaxRate]  = useState(String(item.tax_rate));

  const [updateState, updateAction] = useActionState<ActionResult | null, FormData>(updateInvoiceItem, null);
  const [deleteState, deleteAction] = useActionState<ActionResult | null, FormData>(deleteInvoiceItem, null);

  useEffect(() => {
    if (updateState?.success) { setEditing(false); router.refresh(); }
  }, [updateState]);

  useEffect(() => {
    if (deleteState?.success) router.refresh();
  }, [deleteState]);

  const excl = item.amount;
  const tax  = taxAmt(excl, item.tax_rate);
  const incl = excl + tax;

  if (editing) {
    return (
      <tr className="border-b border-border bg-accent/20">
        <td className="px-2 py-2" colSpan={8}>
          {updateState?.error && (
            <p className="text-xs text-danger mb-2">{updateState.error}</p>
          )}
          <form action={updateAction} className="flex flex-wrap gap-2 items-end">
            <input type="hidden" name="itemId"    value={item.id} />
            <input type="hidden" name="invoiceId" value={invoiceId} />
            <div className="flex-1 min-w-32">
              <Input name="description" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="品目" className="text-sm" />
            </div>
            <div className="w-16">
              <Input name="quantity" type="number" min={1} value={qty} onChange={(e) => setQty(e.target.value)} placeholder="数量" className="text-sm" />
            </div>
            <div className="w-24">
              <Input name="unit_price" type="number" min={0} value={price} onChange={(e) => setPrice(e.target.value)} placeholder="単価" className="text-sm" />
            </div>
            <select name="tax_rate" value={taxRate} onChange={(e) => setTaxRate(e.target.value)} style={selectStyle}>
              {TAX_RATES.map((r) => <option key={r} value={r}>{r}%</option>)}
            </select>
            <button
              type="submit"
              style={{ height: "36px", padding: "0 12px", borderRadius: "4px", fontSize: "13px", fontWeight: 500, cursor: "pointer", backgroundColor: "#f5f5f5", color: "#1a1a1a", border: "1px solid #e0e0e0" } as React.CSSProperties}
            >
              保存
            </button>
            <button type="button" onClick={() => setEditing(false)} className="text-xs text-muted hover:text-foreground transition-colors">
              キャンセル
            </button>
          </form>
        </td>
      </tr>
    );
  }

  return (
    <tr className="border-b border-border last:border-0 hover:bg-accent/20 transition-colors">
      <td className="px-3 py-3 text-sm text-foreground">{item.description}</td>
      <td className="px-3 py-3 text-sm text-muted text-right tabular-nums">{item.quantity}</td>
      <td className="px-3 py-3 text-sm text-muted text-right tabular-nums">¥{item.unit_price.toLocaleString("ja-JP")}</td>
      <td className="px-3 py-3 text-xs text-muted text-right tabular-nums">{item.tax_rate}%</td>
      <td className="px-3 py-3 text-sm text-muted text-right tabular-nums">¥{excl.toLocaleString("ja-JP")}</td>
      <td className="px-3 py-3 text-sm text-muted text-right tabular-nums">¥{tax.toLocaleString("ja-JP")}</td>
      <td className="px-3 py-3 text-sm font-medium text-foreground text-right tabular-nums">¥{incl.toLocaleString("ja-JP")}</td>
      <td className="px-3 py-3">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => setEditing(true)} className="text-xs text-muted hover:text-foreground transition-colors">
            編集
          </button>
          {deleteState?.error && <span className="text-xs text-danger">{deleteState.error}</span>}
          <form action={deleteAction}>
            <input type="hidden" name="itemId"    value={item.id} />
            <input type="hidden" name="invoiceId" value={invoiceId} />
            <button type="submit" className="text-xs text-danger hover:opacity-70 transition-opacity">
              削除
            </button>
          </form>
        </div>
      </td>
    </tr>
  );
}

export function InvoiceItemsEditor({
  invoiceId,
  items,
}: {
  invoiceId: string;
  items:     Item[];
}) {
  const router = useRouter();
  const [addState, addAction] = useActionState<ActionResult | null, FormData>(addInvoiceItem, null);
  const [desc,    setDesc]    = useState("");
  const [qty,     setQty]     = useState("1");
  const [price,   setPrice]   = useState("");
  const [taxRate, setTaxRate] = useState("10");

  useEffect(() => {
    if (addState?.success) {
      setDesc(""); setQty("1"); setPrice(""); setTaxRate("10");
      router.refresh();
    }
  }, [addState]);

  const subtotal  = items.reduce((s, i) => s + i.amount, 0);
  const totalTax  = items.reduce((s, i) => s + taxAmt(i.amount, i.tax_rate), 0);
  const totalIncl = subtotal + totalTax;

  return (
    <div className="rounded-lg border border-border bg-surface p-6">
      <h2 className="text-sm font-semibold text-foreground mb-4">請求明細</h2>

      {/* 追加フォーム（上部固定） */}
      <div className="mb-5 pb-5 border-b border-border">
        {addState?.error && <Alert variant="danger" className="mb-3">{addState.error}</Alert>}
        <form action={addAction} className="flex flex-wrap gap-3 items-end">
          <input type="hidden" name="invoiceId" value={invoiceId} />
          <div className="flex-1 min-w-36">
            <p className="text-xs text-muted mb-1">品目・作業内容</p>
            <Input
              name="description"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="例：エアコン取付工事"
              className="text-sm"
              required
            />
          </div>
          <div className="w-16">
            <p className="text-xs text-muted mb-1">数量</p>
            <Input
              name="quantity"
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              className="text-sm"
              required
            />
          </div>
          <div className="w-28">
            <p className="text-xs text-muted mb-1">単価（円）</p>
            <Input
              name="unit_price"
              type="number"
              min={0}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0"
              className="text-sm"
              required
            />
          </div>
          <div>
            <p className="text-xs text-muted mb-1">税率</p>
            <select
              name="tax_rate"
              value={taxRate}
              onChange={(e) => setTaxRate(e.target.value)}
              style={selectStyle}
            >
              {TAX_RATES.map((r) => <option key={r} value={r}>{r}%</option>)}
            </select>
          </div>
          <AddSubmit />
        </form>
      </div>

      {/* 明細テーブル */}
      {items.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border">
                <th className="px-3 pb-2 text-xs font-semibold text-muted">品目</th>
                <th className="px-3 pb-2 text-xs font-semibold text-muted text-right">数量</th>
                <th className="px-3 pb-2 text-xs font-semibold text-muted text-right">単価</th>
                <th className="px-3 pb-2 text-xs font-semibold text-muted text-right">税率</th>
                <th className="px-3 pb-2 text-xs font-semibold text-muted text-right">税抜金額</th>
                <th className="px-3 pb-2 text-xs font-semibold text-muted text-right">消費税</th>
                <th className="px-3 pb-2 text-xs font-semibold text-muted text-right">税込金額</th>
                <th className="px-3 pb-2"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <ItemRow key={item.id} item={item} invoiceId={invoiceId} />
              ))}
            </tbody>
          </table>

          {/* フッター合計 */}
          <div className="mt-4 pt-4 border-t border-border flex flex-col items-end gap-1.5 text-sm">
            <div className="flex gap-8">
              <span className="text-muted w-24 text-right">小計</span>
              <span className="tabular-nums w-32 text-right">¥{subtotal.toLocaleString("ja-JP")}</span>
            </div>
            <div className="flex gap-8">
              <span className="text-muted w-24 text-right">消費税額</span>
              <span className="tabular-nums w-32 text-right">¥{totalTax.toLocaleString("ja-JP")}</span>
            </div>
            <div className="flex gap-8 font-bold text-foreground border-t border-border pt-2 mt-1">
              <span className="w-24 text-right">合計（税込）</span>
              <span className="tabular-nums w-32 text-right">¥{totalIncl.toLocaleString("ja-JP")}</span>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted text-center py-6">明細が登録されていません。上のフォームから追加してください。</p>
      )}
    </div>
  );
}
