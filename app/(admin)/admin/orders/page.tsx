import type { Metadata } from "next";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import { Button }       from "@/components/ui/button";
import { OrderFilters } from "./_components/OrderFilters";
import { OrderTable }   from "./_components/OrderTable";

export const metadata: Metadata = {
  title: "案件管理 | ServiceHub Admin",
};

type SearchParams = Promise<{ status?: string; q?: string }>;

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { status, q } = await searchParams;

  let query = supabaseAdmin
    .from("orders")
    .select("id, status, work_at, created_at, work_content, customers(name), contractors(company_name)")
    .order("created_at", { ascending: false });

  if (status) query = query.eq("status", status);

  const { data: raw } = await query;
  const orders = (raw ?? []) as unknown as Array<{
    id: string;
    status: string;
    work_at: string | null;
    created_at: string;
    work_content: string;
    customers: { name: string } | null;
    contractors: { company_name: string } | null;
  }>;

  const filtered = q
    ? orders.filter((o) =>
        o.customers?.name?.toLowerCase().includes(q.toLowerCase())
      )
    : orders;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-foreground">案件管理</h1>
          <p className="mt-1 text-sm text-muted">{filtered.length} 件</p>
        </div>
        <Link href="/admin/orders/new">
          <Button size="sm">+ 新規案件登録</Button>
        </Link>
      </div>

      <OrderFilters status={status ?? ""} q={q ?? ""} />

      <div className="rounded-lg border border-border bg-surface overflow-hidden">
        <OrderTable orders={filtered} />
      </div>
    </div>
  );
}
