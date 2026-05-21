"use server";

import { redirect }      from "next/navigation";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase";
import { getSession }    from "@/lib/auth-helpers";

type ActionResult = { error?: string };

export async function approveContractor(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { error: "認証が必要です" };

  const contractorId = formData.get("contractorId") as string;

  const { error } = await supabaseAdmin
    .from("contractors")
    .update({ status: "ACTIVE" })
    .eq("id", contractorId);

  if (error) return { error: "承認に失敗しました" };

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

  const { error } = await supabaseAdmin
    .from("contractors")
    .update({ status: "INACTIVE" })
    .eq("id", contractorId);

  if (error) return { error: "却下に失敗しました" };

  revalidatePath("/admin/contractors/applications");
  revalidatePath("/admin/contractors");
  redirect("/admin/contractors/applications");
}
