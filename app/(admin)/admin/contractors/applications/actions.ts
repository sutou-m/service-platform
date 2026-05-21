"use server";

import { redirect }       from "next/navigation";
import { revalidatePath } from "next/cache";
import { supabaseAdmin }  from "@/lib/supabase";
import { getSession }     from "@/lib/auth-helpers";
import { sendEmail }              from "@/lib/email/send";
import { contractorResultHtml }   from "@/lib/email/templates/contractor-result";

type ActionResult = { error?: string };

export async function approveContractor(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { error: "認証が必要です" };

  const contractorId = formData.get("contractorId") as string;

  const { data: contractor } = await supabaseAdmin
    .from("contractors")
    .select("email, company_name, owner_name")
    .eq("id", contractorId)
    .single();

  const { error } = await supabaseAdmin
    .from("contractors")
    .update({ status: "ACTIVE" })
    .eq("id", contractorId);

  if (error) return { error: "承認に失敗しました" };

  if (contractor) {
    await sendEmail({
      to:      contractor.email,
      subject: "【ServiceHub】業者登録が承認されました",
      html:    contractorResultHtml({
        companyName: contractor.company_name,
        ownerName:   contractor.owner_name,
        result:      "approved",
      }),
    });
  }

  revalidatePath("/admin/contractors/applications");
  revalidatePath("/admin/contractors");
  redirect("/admin/contractors/applications");
}

export async function rejectContractor(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { error: "認証が必要です" };

  const contractorId = formData.get("contractorId") as string;

  const { data: contractor } = await supabaseAdmin
    .from("contractors")
    .select("email, company_name, owner_name")
    .eq("id", contractorId)
    .single();

  const { error } = await supabaseAdmin
    .from("contractors")
    .update({ status: "INACTIVE" })
    .eq("id", contractorId);

  if (error) return { error: "却下に失敗しました" };

  if (contractor) {
    await sendEmail({
      to:      contractor.email,
      subject: "【ServiceHub】業者登録申請の審査結果についてご連絡",
      html:    contractorResultHtml({
        companyName: contractor.company_name,
        ownerName:   contractor.owner_name,
        result:      "rejected",
      }),
    });
  }

  revalidatePath("/admin/contractors/applications");
  revalidatePath("/admin/contractors");
  redirect("/admin/contractors/applications");
}
