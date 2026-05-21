"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase";
import { getSession }    from "@/lib/auth-helpers";

type ActionResult = { error?: string; success?: boolean };

export async function updateCustomerInfo(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { error: "認証が必要です" };

  const customerId = formData.get("customerId") as string;
  const name       = (formData.get("name")    as string).trim();
  const phone      = (formData.get("phone")   as string).trim();
  const email      = (formData.get("email")   as string).trim();
  const address    = (formData.get("address") as string).trim();

  if (!name || !phone || !email) {
    return { error: "氏名・電話番号・メールは必須です" };
  }

  const { error } = await supabaseAdmin
    .from("customers")
    .update({ name, phone, email, address: address || null })
    .eq("id", customerId);

  if (error) return { error: "保存に失敗しました" };

  revalidatePath(`/admin/customers/${customerId}`);
  return { success: true };
}

export async function updateCustomerMemo(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { error: "認証が必要です" };

  const customerId = formData.get("customerId") as string;
  const memo       = formData.get("memo")       as string;

  const { error } = await supabaseAdmin
    .from("customers")
    .update({ memo: memo || null })
    .eq("id", customerId);

  if (error) return { error: "メモの保存に失敗しました" };

  revalidatePath(`/admin/customers/${customerId}`);
  return { success: true };
}
