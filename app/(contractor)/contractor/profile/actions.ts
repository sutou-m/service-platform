"use server";

import { revalidatePath }        from "next/cache";
import { Resend }                from "resend";
import { supabaseAdmin }         from "@/lib/supabase";
import { getContractorSession }  from "@/lib/contractor-session";

export type ActionResult = { error?: string; success?: boolean };

export async function submitChangeRequest(
  _prev:    ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const contractor = await getContractorSession();

  const message = (formData.get("message") as string ?? "").trim();
  if (!message) return { error: "変更内容を入力してください" };
  if (message.length > 1000) return { error: "変更内容は1000文字以内で入力してください" };

  const { error } = await supabaseAdmin.from("notifications").insert({
    id:      crypto.randomUUID(),
    type:    "PROFILE_CHANGE_REQUEST",
    payload: {
      contractor_id: contractor.id,
      company_name:  contractor.company_name,
      message,
      requested_at:  new Date().toISOString(),
    },
    success: false,
  });

  if (error) return { error: "申請の送信に失敗しました: " + error.message };

  /* ── 管理者メール通知 ── */
  try {
    const resend     = new Resend(process.env.RESEND_API_KEY);
    const adminEmail = process.env.ADMIN_EMAIL ?? "admin@servicehub.dev";
    const adminUrl   = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

    await resend.emails.send({
      from:    "onboarding@resend.dev",
      to:      adminEmail,
      subject: "【ServiceHub】業者から情報変更申請が届きました",
      html: `
        <h2>業者から情報変更申請が届きました</h2>
        <p><strong>業者名：</strong>${contractor.company_name}</p>
        <p><strong>申請内容：</strong></p>
        <blockquote style="border-left:3px solid #ccc;margin:0;padding:8px 16px;color:#444;white-space:pre-wrap;">${message}</blockquote>
        <p style="margin-top:16px;">
          <a href="${adminUrl}/admin/contractors" style="color:#1a1a1a;font-weight:600;">
            管理画面で確認する →
          </a>
        </p>
      `,
    });
  } catch (e) {
    console.error("[submitChangeRequest] email error:", e);
  }

  revalidatePath("/contractor/profile");
  return { success: true };
}
