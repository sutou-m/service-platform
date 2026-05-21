import type { Metadata } from "next";
import { supabaseAdmin }       from "@/lib/supabase";
import { InvoiceTable }        from "./_components/InvoiceTable";
import { InvoiceStatusFilter } from "./_components/InvoiceStatusFilter";

export const metadata: Metadata = {
  title: "請求管理 | ServiceHub Admin",
};

type SearchParams = Promise<{ status?: string }>;

export default async function AdminInvoicesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { status } = await searchParams;

  let query = supabaseAdmin
    .from("invoices")
    .select("id, total_amount, status, issue_date, due_date, customers(name)")
    .order("issue_date", { ascending: false });

  if (status) query = query.eq("status", status);

  const { data: raw } = await query;

  const invoices = (raw ?? []) as unknown as Array<{
    id:           string;
    total_amount: number;
    status:       string;
    issue_date:   string;
    due_date:     string | null;
    customers:    { name: string } | null;
  }>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">請求管理</h1>
        <p className="mt-1 text-sm text-muted">{invoices.length} 件</p>
      </div>

      <InvoiceStatusFilter current={status ?? ""} />

      <div className="rounded-lg border border-border bg-surface overflow-hidden">
        <InvoiceTable invoices={invoices} />
      </div>
    </div>
  );
}
