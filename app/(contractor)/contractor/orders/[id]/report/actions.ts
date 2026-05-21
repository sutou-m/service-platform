"use server";

import { redirect }        from "next/navigation";
import { revalidatePath }  from "next/cache";
import { Resend }          from "resend";
import { supabaseAdmin }   from "@/lib/supabase";
import { getContractorSession } from "@/lib/contractor-session";

export type ActionResult = { error?: string; success?: boolean };

/* ────────────────────────────────────────────────
   共通: 写真アップロードヘルパー
──────────────────────────────────────────────── */
async function uploadPhotos(files: File[], orderId: string): Promise<string[]> {
  const urls: string[] = [];
  for (const file of files.slice(0, 10)) {
    if (!["image/jpeg", "image/png"].includes(file.type)) continue;
    if (file.size > 10 * 1024 * 1024) continue;
    const ext  = file.name.split(".").pop() ?? "jpg";
    const path = `${orderId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabaseAdmin.storage
      .from("reports")
      .upload(path, file, { contentType: file.type });
    if (!error) {
      const { data } = supabaseAdmin.storage.from("reports").getPublicUrl(path);
      urls.push(data.publicUrl);
    }
  }
  return urls;
}

/* ────────────────────────────────────────────────
   作業報告 新規登録
──────────────────────────────────────────────── */
export async function submitReport(
  orderId:  string,
  _prev:    ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const contractor = await getContractorSession();

  const { data: order } = await supabaseAdmin
    .from("orders")
    .select("id, status, work_content, work_address, contractor_id")
    .eq("id", orderId)
    .maybeSingle();

  if (!order || order.contractor_id !== contractor.id) {
    return { error: "この案件への報告権限がありません" };
  }

  const workedAt = (formData.get("worked_at") as string).trim();
  const content  = (formData.get("content")   as string).trim();

  if (!workedAt) return { error: "作業日時を入力してください" };
  if (!content)  return { error: "作業内容を入力してください" };

  const workedAtDate = new Date(workedAt);
  if (isNaN(workedAtDate.getTime())) return { error: "作業日時の形式が正しくありません" };

  const files     = (formData.getAll("photos") as File[]).filter((f) => f.size > 0);
  const photoUrls = await uploadPhotos(files, orderId);

  const { error: insertErr } = await supabaseAdmin.from("order_reports").insert({
    id:            crypto.randomUUID(),
    order_id:      orderId,
    contractor_id: contractor.id,
    worked_at:     workedAtDate.toISOString(),
    content,
    photo_urls:    photoUrls,
  });

  if (insertErr) return { error: "報告の保存に失敗しました: " + insertErr.message };

  /* ── ステータス自動遷移 ── */
  if (order.status === "WORK_SCHEDULED") {
    await supabaseAdmin
      .from("orders")
      .update({ status: "WORKING", updated_at: new Date().toISOString() })
      .eq("id", orderId);
    await supabaseAdmin.from("order_status_history").insert({
      id:         crypto.randomUUID(),
      order_id:   orderId,
      status:     "WORKING",
      changed_by: contractor.company_name,
    });
  }

  /* ── 管理者メール通知（直接 Resend） ── */
  try {
    const resend     = new Resend(process.env.RESEND_API_KEY);
    const adminEmail = process.env.ADMIN_EMAIL
      ?? process.env.ADMIN_NOTIFY_EMAIL
      ?? "admin@servicehub.dev";

    await resend.emails.send({
      from:    "onboarding@resend.dev",
      to:      adminEmail,
      subject: "【ServiceHub】作業報告が登録されました",
      html: `
        <h2>作業報告が登録されました</h2>
        <p>案件：${order.work_content}</p>
        <p>業者：${contractor.company_name}</p>
        <p>作業日：${workedAtDate.toLocaleString("ja-JP")}</p>
        <p>内容：${content}</p>
        <p><a href="${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/admin/orders/${orderId}">管理画面で確認する</a></p>
      `,
    });
  } catch (e) {
    console.error("[submitReport] email error:", e);
  }

  redirect(`/contractor/orders/${orderId}`);
}

/* ────────────────────────────────────────────────
   作業報告 編集
──────────────────────────────────────────────── */
export async function updateReport(
  _prev:    ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const contractor = await getContractorSession();

  const reportId = formData.get("reportId") as string;
  const orderId  = formData.get("orderId")  as string;
  const workedAt = (formData.get("worked_at") as string).trim();
  const content  = (formData.get("content")   as string).trim();

  if (!workedAt) return { error: "作業日時を入力してください" };
  if (!content)  return { error: "作業内容を入力してください" };

  const workedAtDate = new Date(workedAt);
  if (isNaN(workedAtDate.getTime())) return { error: "作業日時の形式が正しくありません" };

  /* 所有権確認 */
  const { data: report } = await supabaseAdmin
    .from("order_reports")
    .select("id, contractor_id, order_id")
    .eq("id", reportId)
    .maybeSingle();

  if (!report || report.contractor_id !== contractor.id) {
    return { error: "この報告を編集する権限がありません" };
  }

  /* 写真: 既存の保持 + 新規アップロード */
  const keepPhotos = formData.getAll("keepPhotos") as string[];
  const newFiles   = (formData.getAll("photos") as File[]).filter((f) => f.size > 0);
  const remaining  = Math.max(0, 10 - keepPhotos.length);
  const newUrls    = await uploadPhotos(newFiles.slice(0, remaining), orderId);
  const photoUrls  = [...keepPhotos, ...newUrls];

  const { error } = await supabaseAdmin
    .from("order_reports")
    .update({ worked_at: workedAtDate.toISOString(), content, photo_urls: photoUrls })
    .eq("id", reportId);

  if (error) return { error: "更新に失敗しました: " + error.message };

  revalidatePath(`/contractor/orders/${orderId}`);
  redirect(`/contractor/orders/${orderId}`);
}

/* ────────────────────────────────────────────────
   作業報告 削除
──────────────────────────────────────────────── */
export async function deleteReport(
  _prev:    ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const contractor = await getContractorSession();

  const reportId = formData.get("reportId") as string;
  const orderId  = formData.get("orderId")  as string;

  const { data: report } = await supabaseAdmin
    .from("order_reports")
    .select("id, contractor_id, photo_urls")
    .eq("id", reportId)
    .maybeSingle();

  if (!report || report.contractor_id !== contractor.id) {
    return { error: "この報告を削除する権限がありません" };
  }

  /* ストレージから写真削除（失敗しても続行） */
  const photoUrls = (report.photo_urls as string[]) ?? [];
  if (photoUrls.length > 0) {
    const paths = photoUrls.map((url) => {
      const m = url.match(/\/reports\/(.+)$/);
      return m ? m[1] : null;
    }).filter(Boolean) as string[];
    if (paths.length > 0) {
      await supabaseAdmin.storage.from("reports").remove(paths);
    }
  }

  const { error } = await supabaseAdmin
    .from("order_reports")
    .delete()
    .eq("id", reportId);

  if (error) return { error: "削除に失敗しました: " + error.message };

  revalidatePath(`/contractor/orders/${orderId}`);
  return { success: true };
}
