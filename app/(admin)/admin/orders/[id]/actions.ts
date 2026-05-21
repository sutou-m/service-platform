"use server";

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
