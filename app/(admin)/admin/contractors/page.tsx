import type { Metadata } from "next";
import Link from "next/link";
import { supabaseAdmin }          from "@/lib/supabase";
import { ContractorTable }        from "./_components/ContractorTable";
import { ContractorStatusFilter } from "./_components/ContractorStatusFilter";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "業者管理 | ServiceHub Admin",
};

type SearchParams = Promise<{ status?: string }>;

export default async function AdminContractorsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { status } = await searchParams;
  const currentStatus = status ?? "ACTIVE";

  const [{ data: raw }, { count: pendingCount }] = await Promise.all([
    supabaseAdmin
      .from("contractors")
      .select("id, company_name, owner_name, phone, email, status, areas, created_at")
      .eq("status", currentStatus)
      .order("created_at", { ascending: false }),
    supabaseAdmin
      .from("contractors")
      .select("id", { count: "exact", head: true })
      .eq("status", "PENDING"),
  ]);

  const contractors = (raw ?? []) as Array<{
    id:           string;
    company_name: string;
    owner_name:   string;
    phone:        string;
    email:        string;
    status:       string;
    areas:        string[];
    created_at:   string;
  }>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-foreground">業者管理</h1>
          <p className="mt-1 text-sm text-muted">{contractors.length} 件</p>
        </div>
        <Link
          href="/admin/contractors/applications"
          className="inline-flex items-center gap-2 rounded px-4 py-2 text-sm font-medium transition-opacity hover:opacity-80"
          style={{ backgroundColor: "#1a1a1a", color: "#ffffff" }}
        >
          申請審査
          {(pendingCount ?? 0) > 0 && (
            <Badge variant="warning">{pendingCount}</Badge>
          )}
        </Link>
      </div>

      <ContractorStatusFilter current={currentStatus} />

      <div className="rounded-lg border border-border bg-surface overflow-hidden">
        <ContractorTable contractors={contractors} />
      </div>
    </div>
  );
}
