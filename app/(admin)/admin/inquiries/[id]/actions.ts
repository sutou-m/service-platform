"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase";
import { getSession } from "@/lib/auth-helpers";

type ActionResult = { error?: string; success?: boolean };

export async function convertToOrder(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { error: "認証が必要です" };

  const inquiryId = formData.get("inquiryId") as string;

  const { data: inquiry, error: fetchError } = await supabaseAdmin
    .from("inquiries")
    .select("*")
    .eq("id", inquiryId)
    .single();

  if (fetchError || !inquiry) return { error: "問い合わせが見つかりません" };
  if (inquiry.status === "CONVERTED") return { error: "すでに案件に変換済みです" };

  // 顧客レコードを取得または作成
  let customerId: string = inquiry.customer_id;
  if (!customerId) {
    // 同メールの既存顧客を先に検索
    const { data: existing } = await supabaseAdmin
      .from("customers")
      .select("id")
      .eq("email", inquiry.email)
      .single();

    if (existing) {
      customerId = existing.id;
    } else {
      const { data: customer, error: custError } = await supabaseAdmin
        .from("customers")
        .insert({
          name:    inquiry.name,
          phone:   inquiry.phone,
          email:   inquiry.email,
          address: inquiry.address,
        })
        .select("id")
        .single();

      if (custError || !customer) {
        console.error("[convertToOrder] customer insert:", custError?.code, custError?.message);
        return { error: "顧客の作成に失敗しました" };
      }
      customerId = customer.id;
    }

    await supabaseAdmin
      .from("inquiries")
      .update({ customer_id: customerId })
      .eq("id", inquiryId);
  }

  // 案件作成
  const { data: order, error: orderError } = await supabaseAdmin
    .from("orders")
    .insert({
      customer_id:  customerId,
      inquiry_id:   inquiryId,
      work_content: inquiry.work_content,
      work_address: inquiry.address,
      status:       "NEW",
    })
    .select("id")
    .single();

  if (orderError || !order) {
    console.error("[convertToOrder] order insert:", orderError?.code, orderError?.message);
    return { error: "案件の作成に失敗しました" };
  }

  // 問い合わせステータスを CONVERTED に更新
  await supabaseAdmin
    .from("inquiries")
    .update({ status: "CONVERTED" })
    .eq("id", inquiryId);

  redirect(`/admin/orders/${order.id}`);
}

export async function updateStatus(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { error: "認証が必要です" };

  const inquiryId = formData.get("inquiryId") as string;
  const status    = formData.get("status") as string;

  const { error } = await supabaseAdmin
    .from("inquiries")
    .update({ status })
    .eq("id", inquiryId);

  if (error) return { error: "ステータスの更新に失敗しました" };

  revalidatePath(`/admin/inquiries/${inquiryId}`);
  revalidatePath("/admin/inquiries");
  return { success: true };
}

export async function updateMemo(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { error: "認証が必要です" };

  const inquiryId = formData.get("inquiryId") as string;
  const memo      = formData.get("memo") as string;

  const { error } = await supabaseAdmin
    .from("inquiries")
    .update({ memo: memo || null })
    .eq("id", inquiryId);

  if (error) return { error: "メモの保存に失敗しました" };

  revalidatePath(`/admin/inquiries/${inquiryId}`);
  return { success: true };
}
