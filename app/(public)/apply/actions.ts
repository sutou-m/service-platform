"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import { sendEmail }       from "@/lib/email/send";
import { applyNotifyHtml } from "@/lib/email/templates/apply-notify";

const phoneRegex = /^0\d{1,4}-\d{1,4}-\d{4}$/;

const applySchema = z.object({
  companyName:  z.string().min(1, "会社名（屋号）を入力してください"),
  ownerName:    z.string().min(1, "代表者名を入力してください"),
  address:      z.string().min(1, "住所を入力してください"),
  phone:        z.string().regex(phoneRegex, "電話番号の形式が正しくありません（例：090-1234-5678）"),
  email:        z.string().email("メールアドレスの形式が正しくありません"),
  areas:        z.array(z.string()).min(1, "対応可能エリアを1つ以上選択してください"),
  serviceTypes: z.array(z.string()).min(1, "対応可能作業種別を1つ以上選択してください"),
  bio:          z.string().optional(),
});

export type ActionResult = {
  errors?: {
    companyName?:  string[];
    ownerName?:    string[];
    address?:      string[];
    phone?:        string[];
    email?:        string[];
    areas?:        string[];
    serviceTypes?: string[];
    bio?:          string[];
    _form?:        string[];
  };
};

export async function submitApply(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const parsed = applySchema.safeParse({
    companyName:  formData.get("companyName"),
    ownerName:    formData.get("ownerName"),
    address:      formData.get("address"),
    phone:        formData.get("phone"),
    email:        formData.get("email"),
    areas:        formData.getAll("areas"),
    serviceTypes: formData.getAll("serviceTypes"),
    bio:          formData.get("bio") || undefined,
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const { error: dbError } = await supabaseAdmin.from("contractors").insert({
    company_name:  parsed.data.companyName,
    owner_name:    parsed.data.ownerName,
    address:       parsed.data.address,
    phone:         parsed.data.phone,
    email:         parsed.data.email,
    areas:         parsed.data.areas,
    service_types: parsed.data.serviceTypes,
    bio:           parsed.data.bio ?? null,
    status:        "PENDING",
  });

  if (dbError) {
    console.error(
      "[submitApply] DB insert error:",
      dbError.code,
      dbError.message,
      dbError.details
    );
    return { errors: { _form: ["送信に失敗しました。しばらく経ってから再度お試しください"] } };
  }

  await sendEmail({
    to:      process.env.ADMIN_EMAIL ?? process.env.ADMIN_NOTIFY_EMAIL ?? "admin@servicehub.dev",
    subject: "【ServiceHub】新規業者申請が届きました",
    html:    applyNotifyHtml({
      companyName:  parsed.data.companyName,
      ownerName:    parsed.data.ownerName,
      email:        parsed.data.email,
      phone:        parsed.data.phone,
      areas:        parsed.data.areas,
      serviceTypes: parsed.data.serviceTypes,
    }),
  });

  redirect("/apply/thanks");
}
