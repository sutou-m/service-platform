"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin }  from "@/lib/supabase";
import { getSession, hashPassword } from "@/lib/auth-helpers";

export type ActionResult = { error?: string; success?: boolean };

export async function updateContractorInfo(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { error: "認証が必要です" };

  const contractorId  = formData.get("contractorId")  as string;
  const company_name  = (formData.get("company_name") as string).trim();
  const owner_name    = (formData.get("owner_name")   as string).trim();
  const address       = (formData.get("address")      as string).trim();
  const phone         = (formData.get("phone")        as string).trim();
  const email         = (formData.get("email")        as string).trim();
  const bio           = (formData.get("bio")          as string).trim();
  const areas         = formData.getAll("areas")         as string[];
  const service_types = formData.getAll("service_types") as string[];

  if (!company_name || !owner_name || !address || !phone || !email) {
    return { error: "会社名・代表者名・住所・電話番号・メールは必須です" };
  }

  const { error } = await supabaseAdmin
    .from("contractors")
    .update({ company_name, owner_name, address, phone, email, bio: bio || null, areas, service_types })
    .eq("id", contractorId);

  if (error) return { error: "保存に失敗しました" };

  revalidatePath(`/admin/contractors/${contractorId}`);
  return { success: true };
}

export async function updateCreditLimit(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { error: "認証が必要です" };

  const contractorId = formData.get("contractorId") as string;
  const raw          = formData.get("creditLimit")  as string;
  const creditLimit  = parseInt(raw, 10);

  if (isNaN(creditLimit) || creditLimit < 0) {
    return { error: "0以上の整数を入力してください" };
  }

  const { error } = await supabaseAdmin
    .from("contractors")
    .update({ credit_limit: creditLimit })
    .eq("id", contractorId);

  if (error) return { error: "保存に失敗しました" };

  revalidatePath(`/admin/contractors/${contractorId}`);
  return { success: true };
}

/* ─── 業者ログインアカウント管理 ────────────────── */

export async function issueContractorLogin(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { error: "認証が必要です" };

  const contractorId = formData.get("contractorId") as string;
  const email        = (formData.get("email") as string).trim();
  const password     = formData.get("password") as string;

  if (!email)              return { error: "メールアドレスを入力してください" };
  if (password.length < 8) return { error: "パスワードは8文字以上で入力してください" };

  // 既存ユーザー重複チェック
  const { data: dup } = await supabaseAdmin
    .from("users")
    .select("id")
    .eq("email", email)
    .maybeSingle();
  if (dup) return { error: "このメールアドレスはすでに登録されています" };

  // ユーザー作成
  const hash   = await hashPassword(password);
  const userId = crypto.randomUUID();
  const { error: userErr } = await supabaseAdmin.from("users").insert({
    id:       userId,
    name:     email,
    email,
    password: hash,
    role:     "CONTRACTOR",
  });
  if (userErr) return { error: "ユーザー作成に失敗しました" };

  // 業者に紐付け
  const { error: linkErr } = await supabaseAdmin
    .from("contractors")
    .update({ user_id: userId })
    .eq("id", contractorId);
  if (linkErr) {
    // ロールバック：作成したユーザーを削除
    await supabaseAdmin.from("users").delete().eq("id", userId);
    return { error: "紐付けに失敗しました" };
  }

  revalidatePath(`/admin/contractors/${contractorId}`);
  return { success: true };
}

export async function resetContractorPassword(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { error: "認証が必要です" };

  const contractorId = formData.get("contractorId") as string;
  const userId       = formData.get("userId")       as string;
  const password     = formData.get("password")     as string;

  if (password.length < 8) return { error: "パスワードは8文字以上で入力してください" };

  const hash = await hashPassword(password);
  const { error } = await supabaseAdmin
    .from("users")
    .update({ password: hash })
    .eq("id", userId);
  if (error) return { error: "パスワードの更新に失敗しました" };

  revalidatePath(`/admin/contractors/${contractorId}`);
  return { success: true };
}

export async function unlinkContractorLogin(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { error: "認証が必要です" };

  const contractorId = formData.get("contractorId") as string;
  const userId       = formData.get("userId")       as string;

  // 業者の user_id を null に
  const { error: unlinkErr } = await supabaseAdmin
    .from("contractors")
    .update({ user_id: null })
    .eq("id", contractorId);
  if (unlinkErr) return { error: "解除に失敗しました" };

  // ユーザー削除
  await supabaseAdmin.from("users").delete().eq("id", userId);

  revalidatePath(`/admin/contractors/${contractorId}`);
  return { success: true };
}

export async function updateContractorStatus(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { error: "認証が必要です" };

  const contractorId = formData.get("contractorId") as string;
  const status       = formData.get("status")       as string;

  if (!["ACTIVE", "INACTIVE"].includes(status)) {
    return { error: "不正なステータスです" };
  }

  const { error } = await supabaseAdmin
    .from("contractors")
    .update({ status })
    .eq("id", contractorId);

  if (error) return { error: "ステータスの更新に失敗しました" };

  revalidatePath(`/admin/contractors/${contractorId}`);
  revalidatePath("/admin/contractors");
  return { success: true };
}
