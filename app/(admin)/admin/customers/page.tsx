import type { Metadata } from "next";
import { supabaseAdmin }   from "@/lib/supabase";
import { CustomerTable }   from "./_components/CustomerTable";
import { CustomerSearch }  from "./_components/CustomerSearch";

export const metadata: Metadata = {
  title: "顧客管理 | ServiceHub Admin",
};

type SearchParams = Promise<{ q?: string }>;

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { q } = await searchParams;

  const { data: raw } = await supabaseAdmin
    .from("customers")
    .select("id, name, phone, email, created_at")
    .order("created_at", { ascending: false });

  const customers = (raw ?? []) as Array<{
    id:         string;
    name:       string;
    phone:      string;
    email:      string;
    created_at: string;
  }>;

  const filtered = q
    ? customers.filter(
        (c) =>
          c.name.toLowerCase().includes(q.toLowerCase()) ||
          c.email.toLowerCase().includes(q.toLowerCase())
      )
    : customers;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-foreground">顧客管理</h1>
          <p className="mt-1 text-sm text-muted">{filtered.length} 件</p>
        </div>
      </div>

      <CustomerSearch q={q ?? ""} />

      <div className="rounded-lg border border-border bg-surface overflow-hidden">
        <CustomerTable customers={filtered} />
      </div>
    </div>
  );
}
