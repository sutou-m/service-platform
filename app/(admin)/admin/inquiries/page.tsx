import type { Metadata } from "next";
import { supabaseAdmin } from "@/lib/supabase";
import { StatusFilter }  from "./_components/StatusFilter";
import { InquiryTable }  from "./_components/InquiryTable";

export const metadata: Metadata = {
  title: "問い合わせ管理 | ServiceHub Admin",
};

type SearchParams = Promise<{ status?: string }>;

export default async function AdminInquiriesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { status } = await searchParams;

  let query = supabaseAdmin
    .from("inquiries")
    .select("id, name, phone, work_content, created_at, status")
    .order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  const { data: inquiries } = await query;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">問い合わせ管理</h1>
        <p className="mt-1 text-sm text-muted">
          {inquiries?.length ?? 0} 件
        </p>
      </div>

      <StatusFilter current={status ?? ""} />

      <div className="rounded-lg border border-border bg-surface overflow-hidden">
        <InquiryTable inquiries={inquiries ?? []} />
      </div>
    </div>
  );
}
