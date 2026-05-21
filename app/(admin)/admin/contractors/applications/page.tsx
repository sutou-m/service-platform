import type { Metadata } from "next";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import { ApplicationRow } from "./_components/ApplicationRow";

export const metadata: Metadata = {
  title: "業者申請管理 | ServiceHub Admin",
};

export default async function ContractorApplicationsPage() {
  const { data: raw } = await supabaseAdmin
    .from("contractors")
    .select("id, company_name, owner_name, phone, email, areas, service_types, created_at")
    .eq("status", "PENDING")
    .order("created_at", { ascending: true });

  const applications = (raw ?? []) as Array<{
    id:            string;
    company_name:  string;
    owner_name:    string;
    phone:         string;
    email:         string;
    areas:         string[];
    service_types: string[];
    created_at:    string;
  }>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Link
              href="/admin/contractors"
              className="text-xs text-muted hover:text-foreground transition-colors"
            >
              ← 業者一覧
            </Link>
          </div>
          <h1 className="text-xl font-bold text-foreground">業者申請管理</h1>
          <p className="mt-1 text-sm text-muted">
            審査待ち {applications.length} 件
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-surface overflow-hidden">
        {applications.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted">審査待ちの申請はありません</p>
        ) : (
          <table className="w-full text-left">
            <thead className="border-b border-border bg-accent">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold text-muted">会社名</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted hidden sm:table-cell">代表者</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted hidden md:table-cell">電話番号</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted hidden lg:table-cell">対応エリア</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted hidden sm:table-cell">申請日</th>
                <th className="px-4 py-3 text-xs font-semibold text-muted">操作</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((c) => (
                <ApplicationRow key={c.id} contractor={c} />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
