"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase";
import { getSession }    from "@/lib/auth-helpers";

const schema = z.object({
  customerId:   z.string().min(1, "顧客を選択してください"),
  workContent:  z.string().min(1, "作業内容を入力してください"),
  workAddress:  z.string().min(1, "作業場所を入力してください"),
  visitAt:      z.string().optional(),
  workAt:       z.string().optional(),
  contractorId: z.string().optional(),
  internalMemo: z.string().optional(),
});

export type ActionResult = {
  errors?: Record<string, string[]>;
  _form?: string;
};

export async function createOrder(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { _form: "認証が必要です" };

  const parsed = schema.safeParse({
    customerId:   formData.get("customerId"),
    workContent:  formData.get("workContent"),
    workAddress:  formData.get("workAddress"),
    visitAt:      formData.get("visitAt") || undefined,
    workAt:       formData.get("workAt")  || undefined,
    contractorId: formData.get("contractorId") || undefined,
    internalMemo: formData.get("internalMemo") || undefined,
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const d = parsed.data;

  const { data: order, error: orderError } = await supabaseAdmin
    .from("orders")
    .insert({
      customer_id:   d.customerId,
      work_content:  d.workContent,
      work_address:  d.workAddress,
      visit_at:      d.visitAt ? new Date(d.visitAt).toISOString() : null,
      work_at:       d.workAt  ? new Date(d.workAt).toISOString()  : null,
      contractor_id: d.contractorId ?? null,
      internal_memo: d.internalMemo ?? null,
      status:        "NEW",
    })
    .select("id")
    .single();

  if (orderError || !order) {
    console.error("[createOrder]", orderError?.code, orderError?.message);
    return { _form: "案件の作成に失敗しました" };
  }

  await supabaseAdmin.from("order_status_history").insert({
    order_id:   order.id,
    status:     "NEW",
    changed_by: session.user.email ?? session.user.name ?? "admin",
  });

  redirect(`/admin/orders/${order.id}`);
}
