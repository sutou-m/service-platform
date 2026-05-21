"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase";
import { getSession }    from "@/lib/auth-helpers";

type ActionResult = { error?: string; success?: boolean };

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
