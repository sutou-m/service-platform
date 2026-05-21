"use server";

import { redirect }       from "next/navigation";
import { revalidatePath } from "next/cache";
import { supabaseAdmin }  from "@/lib/supabase";
import { getSession }     from "@/lib/auth-helpers";

type ActionResult = { error?: string; success?: boolean };

/** 税込金額を計算（端数切り捨て） */
function taxIncl(taxExcl: number, taxRate: number): number {
  return taxExcl + Math.floor(taxExcl * taxRate / 100);
}

/** 合計と入金ステータスを再計算して invoices を更新 */
async function syncInvoiceTotalAndStatus(invoiceId: string) {
  const [{ data: items }, { data: payments }] = await Promise.all([
    supabaseAdmin
      .from("invoice_items")
      .select("amount, tax_rate")
      .eq("invoice_id", invoiceId),
    supabaseAdmin
      .from("payments")
      .select("amount")
      .eq("invoice_id", invoiceId),
  ]);

  const total = (items ?? []).reduce((s, i) => {
    const rate = (i as { amount: number; tax_rate?: number }).tax_rate ?? 10;
    return s + taxIncl(i.amount, rate);
  }, 0);

  const totalPaid = (payments ?? []).reduce((s, p) => s + p.amount, 0);
  const status    = total > 0 && totalPaid >= total ? "PAID" : totalPaid > 0 ? "PARTIAL" : "UNPAID";

  await supabaseAdmin
    .from("invoices")
    .update({ total_amount: total, status })
    .eq("id", invoiceId);
}

export async function addInvoiceItem(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { error: "認証が必要です" };

  const invoiceId   = formData.get("invoiceId")   as string;
  const description = (formData.get("description") as string).trim();
  const quantity    = parseInt(formData.get("quantity")   as string, 10);
  const unit_price  = parseInt(formData.get("unit_price") as string, 10);
  const tax_rate    = parseInt(formData.get("tax_rate")   as string, 10);

  if (!description || isNaN(quantity) || quantity <= 0 || isNaN(unit_price) || unit_price < 0) {
    return { error: "品目・数量・単価を正しく入力してください" };
  }
  if (![0, 8, 10].includes(isNaN(tax_rate) ? -1 : tax_rate)) {
    return { error: "税率が不正です" };
  }

  const { error } = await supabaseAdmin.from("invoice_items").insert({
    invoice_id:  invoiceId,
    description,
    quantity,
    unit_price,
    amount:      quantity * unit_price,  // 税抜金額
    tax_rate,
  });
  if (error) return { error: "明細の追加に失敗しました" };

  await syncInvoiceTotalAndStatus(invoiceId);
  revalidatePath(`/admin/invoices/${invoiceId}`);
  return { success: true };
}

export async function updateInvoiceItem(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { error: "認証が必要です" };

  const itemId      = formData.get("itemId")       as string;
  const invoiceId   = formData.get("invoiceId")    as string;
  const description = (formData.get("description") as string).trim();
  const quantity    = parseInt(formData.get("quantity")   as string, 10);
  const unit_price  = parseInt(formData.get("unit_price") as string, 10);
  const tax_rate    = parseInt(formData.get("tax_rate")   as string, 10);

  if (!description || isNaN(quantity) || quantity <= 0 || isNaN(unit_price) || unit_price < 0) {
    return { error: "品目・数量・単価を正しく入力してください" };
  }

  const { error } = await supabaseAdmin.from("invoice_items")
    .update({ description, quantity, unit_price, amount: quantity * unit_price, tax_rate: isNaN(tax_rate) ? 10 : tax_rate })
    .eq("id", itemId);
  if (error) return { error: "明細の更新に失敗しました" };

  await syncInvoiceTotalAndStatus(invoiceId);
  revalidatePath(`/admin/invoices/${invoiceId}`);
  return { success: true };
}

export async function deleteInvoiceItem(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { error: "認証が必要です" };

  const itemId    = formData.get("itemId")    as string;
  const invoiceId = formData.get("invoiceId") as string;

  const { error } = await supabaseAdmin.from("invoice_items").delete().eq("id", itemId);
  if (error) return { error: "明細の削除に失敗しました" };

  await syncInvoiceTotalAndStatus(invoiceId);
  revalidatePath(`/admin/invoices/${invoiceId}`);
  return { success: true };
}

export async function addPayment(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { error: "認証が必要です" };

  const invoiceId = formData.get("invoiceId") as string;
  const amount    = parseInt(formData.get("amount") as string, 10);
  const paid_at   = formData.get("paid_at") as string;
  const note      = (formData.get("note") as string).trim();

  if (isNaN(amount) || amount <= 0) return { error: "金額を正しく入力してください" };
  if (!paid_at) return { error: "入金日を入力してください" };

  const { error } = await supabaseAdmin.from("payments").insert({
    invoice_id: invoiceId,
    amount,
    paid_at: new Date(paid_at).toISOString(),
    note: note || null,
  });
  if (error) return { error: "入金登録に失敗しました" };

  await syncInvoiceTotalAndStatus(invoiceId);
  revalidatePath(`/admin/invoices/${invoiceId}`);
  revalidatePath("/admin/invoices");
  return { success: true };
}

export async function updateDueDate(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { error: "認証が必要です" };

  const invoiceId = formData.get("invoiceId") as string;
  const due_date  = formData.get("due_date")  as string;

  const { error } = await supabaseAdmin.from("invoices")
    .update({ due_date: due_date ? new Date(due_date).toISOString() : null })
    .eq("id", invoiceId);
  if (error) return { error: "支払期限の更新に失敗しました" };

  revalidatePath(`/admin/invoices/${invoiceId}`);
  return { success: true };
}

export async function deleteInvoice(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { error: "認証が必要です" };

  const invoiceId = formData.get("invoiceId") as string;

  const { data: inv } = await supabaseAdmin
    .from("invoices")
    .select("status")
    .eq("id", invoiceId)
    .single();

  if (!inv) return { error: "請求書が見つかりません" };
  if (inv.status !== "UNPAID") return { error: "未払いの請求書のみ削除できます" };

  await supabaseAdmin.from("invoice_items").delete().eq("invoice_id", invoiceId);
  await supabaseAdmin.from("payments").delete().eq("invoice_id", invoiceId);

  const { error } = await supabaseAdmin.from("invoices").delete().eq("id", invoiceId);
  if (error) return { error: "削除に失敗しました" };

  revalidatePath("/admin/invoices");
  redirect("/admin/invoices");
}
