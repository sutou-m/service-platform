import { redirect }     from "next/navigation";
import { getSession }    from "@/lib/auth-helpers";
import { supabaseAdmin } from "@/lib/supabase";

export type ContractorInfo = {
  id:           string;
  company_name: string;
  status:       string;
};

export async function getContractorSession(): Promise<ContractorInfo> {
  const session = await getSession();
  if (!session || session.user.role !== "CONTRACTOR") {
    redirect("/contractor/login");
  }

  const { data } = await supabaseAdmin
    .from("contractors")
    .select("id, company_name, status")
    .eq("user_id", session.user.id)
    .maybeSingle();

  if (!data) redirect("/contractor/login");

  return data as ContractorInfo;
}
