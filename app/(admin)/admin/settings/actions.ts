"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin }  from "@/lib/supabase";
import { getSession }     from "@/lib/auth-helpers";
import { hashPassword }   from "@/lib/auth-helpers";

export type ActionResult = { error?: string; success?: boolean };

/* ─── 管理者アカウント ─────────────────────────── */

export async function createAdmin(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { error: "認証が必要です" };

  const name     = (formData.get("name")     as string).trim();
  const email    = (formData.get("email")    as string).trim();
  const password = (formData.get("password") as string);

  if (!name)     return { error: "名前を入力してください" };
  if (!email)    return { error: "メールアドレスを入力してください" };
  if (password.length < 8) return { error: "パスワードは8文字以上で入力してください" };

  const { data: dup } = await supabaseAdmin
    .from("users")
    .select("id")
    .eq("email", email)
    .maybeSingle();
  if (dup) return { error: "このメールアドレスはすでに登録されています" };

  const hash = await hashPassword(password);

  const { error } = await supabaseAdmin.from("users").insert({
    id:    crypto.randomUUID(),
    name,
    email,
    password: hash,
    role:     "ADMIN",
  });
  if (error) return { error: "アカウントの作成に失敗しました" };

  revalidatePath("/admin/settings");
  return { success: true };
}

export async function deleteAdmin(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { error: "認証が必要です" };

  const userId = formData.get("userId") as string;

  if (session.user.id === userId) {
    return { error: "自分自身のアカウントは削除できません" };
  }

  const { error } = await supabaseAdmin.from("users").delete().eq("id", userId);
  if (error) return { error: "削除に失敗しました" };

  revalidatePath("/admin/settings");
  return { success: true };
}

/* ─── メール通知設定 ──────────────────────────── */

export async function updateNotifyEmail(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { error: "認証が必要です" };

  const email = (formData.get("email") as string).trim();
  if (!email) return { error: "メールアドレスを入力してください" };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "メールアドレスの形式が正しくありません" };
  }

  const { error } = await supabaseAdmin
    .from("system_configs")
    .upsert(
      { key: "admin_notify_email", value: email, updated_at: new Date().toISOString() },
      { onConflict: "key" }
    );
  if (error) return { error: "保存に失敗しました" };

  revalidatePath("/admin/settings");
  return { success: true };
}

/* ─── サービス種別マスタ ─────────────────────── */

export async function updateServiceTypes(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { error: "認証が必要です" };

  const types = (formData.getAll("types") as string[]).map((t) => t.trim()).filter(Boolean);
  if (types.length === 0) return { error: "種別が1件以上必要です" };

  const { error } = await supabaseAdmin
    .from("system_configs")
    .upsert(
      { key: "service_types", value: JSON.stringify(types), updated_at: new Date().toISOString() },
      { onConflict: "key" }
    );
  if (error) return { error: "保存に失敗しました" };

  revalidatePath("/admin/settings");
  return { success: true };
}
