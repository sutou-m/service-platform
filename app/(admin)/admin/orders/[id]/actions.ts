"use server";

import { redirect }      from "next/navigation";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase";
import { getSession }    from "@/lib/auth-helpers";

type ActionResult = { error?: string; success?: boolean };

export async function changeStatus(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { error: "認証が必要です" };

  const orderId = formData.get("orderId") as string;
  const status  = formData.get("status")  as string;

  const { error: updateError } = await supabaseAdmin
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", orderId);

  if (updateError) return { error: "ステータスの更新に失敗しました" };

  await supabaseAdmin.from("order_status_history").insert({
    order_id:   orderId,
    status,
    changed_by: session.user.email ?? session.user.name ?? "admin",
  });

  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/orders");
  return { success: true };
}

export async function assignContractor(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { error: "認証が必要です" };

  const orderId      = formData.get("orderId")      as string;
  const contractorId = formData.get("contractorId") as string;

  const { error } = await supabaseAdmin
    .from("orders")
    .update({
      contractor_id: contractorId || null,
      updated_at:    new Date().toISOString(),
    })
    .eq("id", orderId);

  if (error) return { error: "業者の割り当てに失敗しました" };

  revalidatePath(`/admin/orders/${orderId}`);
  return { success: true };
}

export async function updateOrderMemo(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { error: "認証が必要です" };

  const orderId      = formData.get("orderId")      as string;
  const internalMemo = formData.get("internalMemo") as string;

  const { error } = await supabaseAdmin
    .from("orders")
    .update({ internal_memo: internalMemo || null, updated_at: new Date().toISOString() })
    .eq("id", orderId);

  if (error) return { error: "メモの保存に失敗しました" };

  revalidatePath(`/admin/orders/${orderId}`);
  return { success: true };
}

const EDITABLE_FIELDS = ["visit_at", "work_at", "internal_memo"] as const;
type EditableField = (typeof EDITABLE_FIELDS)[number];

export async function updateOrderField(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { error: "認証が必要です" };

  const orderId = formData.get("orderId") as string;
  const field   = formData.get("field")   as string;
  const value   = formData.get("value")   as string;

  if (!(EDITABLE_FIELDS as readonly string[]).includes(field)) {
    return { error: "不正なフィールドです" };
  }

  const dbValue =
    field === "internal_memo"
      ? (value || null)
      : (value ? new Date(value).toISOString() : null);

  const { error } = await supabaseAdmin
    .from("orders")
    .update({ [field as EditableField]: dbValue, updated_at: new Date().toISOString() })
    .eq("id", orderId);

  if (error) return { error: "保存に失敗しました" };

  revalidatePath(`/admin/orders/${orderId}`);
  return { success: true };
}

export async function createInvoice(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { error: "認証が必要です" };

  const orderId = formData.get("orderId") as string;

  // 既存請求書があればそちらへ遷移
  const { data: existing } = await supabaseAdmin
    .from("invoices")
    .select("id")
    .eq("order_id", orderId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (existing) redirect(`/admin/invoices/${existing.id}`);

  // 案件から顧客IDを取得
  const { data: order } = await supabaseAdmin
    .from("orders")
    .select("customer_id")
    .eq("id", orderId)
    .single();

  if (!order) return { error: "案件が見つかりません" };

  const issueDate = new Date();
  const dueDate   = new Date(issueDate);
  dueDate.setDate(dueDate.getDate() + 30);

  const { data: invoice, error } = await supabaseAdmin
    .from("invoices")
    .insert({
      order_id:     orderId,
      customer_id:  order.customer_id,
      issue_date:   issueDate.toISOString(),
      due_date:     dueDate.toISOString(),
      total_amount: 0,
      status:       "UNPAID",
    })
    .select("id")
    .single();

  if (error || !invoice) return { error: "請求書の作成に失敗しました" };

  revalidatePath(`/admin/orders/${orderId}`);
  redirect(`/admin/invoices/${invoice.id}`);
}
