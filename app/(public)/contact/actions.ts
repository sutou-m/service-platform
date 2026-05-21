"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import { sendEmail } from "@/lib/email/send";
import { inquiryConfirmHtml } from "@/lib/email/templates/inquiry-confirm";
import { inquiryNotifyHtml }  from "@/lib/email/templates/inquiry-notify";

const phoneRegex = /^0\d{1,4}-\d{1,4}-\d{4}$/;

const contactSchema = z.object({
  name:        z.string().min(1, "氏名を入力してください"),
  phone:       z.string().regex(phoneRegex, "電話番号の形式が正しくありません（例：090-1234-5678）"),
  email:       z.string().email("メールアドレスの形式が正しくありません"),
  address:     z.string().min(1, "住所を入力してください"),
  workContent: z.string().min(1, "希望作業内容を入力してください"),
  preferredAt: z.string().optional(),
  notes:       z.string().optional(),
});

export type ActionResult = {
  errors?: {
    name?:        string[];
    phone?:       string[];
    email?:       string[];
    address?:     string[];
    workContent?: string[];
    preferredAt?: string[];
    notes?:       string[];
    photos?:      string[];
    _form?:       string[];
  };
};

export async function submitContact(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  // バリデーション
  const parsed = contactSchema.safeParse({
    name:        formData.get("name"),
    phone:       formData.get("phone"),
    email:       formData.get("email"),
    address:     formData.get("address"),
    workContent: formData.get("workContent"),
    preferredAt: formData.get("preferredAt") || undefined,
    notes:       formData.get("notes") || undefined,
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  // 写真バリデーション
  const photos = (formData.getAll("photos") as File[]).filter((f) => f.size > 0);

  if (photos.length > 5) {
    return { errors: { photos: ["写真は最大5枚までアップロードできます"] } };
  }
  for (const photo of photos) {
    if (photo.size > 5 * 1024 * 1024) {
      return { errors: { photos: ["写真は1枚5MB以下にしてください"] } };
    }
    if (!["image/jpeg", "image/png"].includes(photo.type)) {
      return { errors: { photos: ["JPEG・PNG形式のみアップロードできます"] } };
    }
  }

  // 写真を Supabase Storage にアップロード
  const photoUrls: string[] = [];
  for (const photo of photos) {
    const ext  = photo.type === "image/png" ? "png" : "jpg";
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabaseAdmin.storage
      .from("inquiries")
      .upload(path, photo, { contentType: photo.type });

    if (error) {
      return { errors: { _form: ["写真のアップロードに失敗しました。再度お試しください"] } };
    }
    const { data } = supabaseAdmin.storage.from("inquiries").getPublicUrl(path);
    photoUrls.push(data.publicUrl);
  }

  // inquiries テーブルに保存（supabaseAdmin = service role、RLS をバイパス）
  // id は DB DEFAULT (gen_random_uuid()) に任せるが、念のため明示生成も可
  const { error: dbError } = await supabaseAdmin.from("inquiries").insert({
    name:         parsed.data.name,
    phone:        parsed.data.phone,
    email:        parsed.data.email,
    address:      parsed.data.address,
    work_content: parsed.data.workContent,
    preferred_at: parsed.data.preferredAt
      ? new Date(parsed.data.preferredAt).toISOString()
      : null,
    notes:      parsed.data.notes ?? null,
    photo_urls: photoUrls,
  });

  if (dbError) {
    console.error(
      "[submitContact] DB insert error:",
      dbError.code,
      dbError.message,
      dbError.details
    );
    return { errors: { _form: ["送信に失敗しました。しばらく経ってから再度お試しください"] } };
  }

  const adminEmail = process.env.ADMIN_EMAIL ?? process.env.ADMIN_NOTIFY_EMAIL ?? "admin@servicehub.dev";

  await Promise.all([
    sendEmail({
      to:      parsed.data.email,
      subject: "【ServiceHub】お問い合わせを受け付けました",
      html:    inquiryConfirmHtml({
        name:        parsed.data.name,
        workContent: parsed.data.workContent,
        preferredAt: parsed.data.preferredAt,
        notes:       parsed.data.notes,
      }),
    }),
    sendEmail({
      to:      adminEmail,
      subject: "【ServiceHub】新規問い合わせが届きました",
      html:    inquiryNotifyHtml({
        name:         parsed.data.name,
        email:        parsed.data.email,
        phone:        parsed.data.phone,
        address:      parsed.data.address,
        workContent:  parsed.data.workContent,
        preferredAt:  parsed.data.preferredAt,
        notes:        parsed.data.notes,
      }),
    }),
  ]);

  redirect("/contact/thanks");
}
