import type { Metadata } from "next";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import { OrderForm } from "./_components/OrderForm";

export const metadata: Metadata = {
  title: "新規案件登録 | ServiceHub Admin",
};

export default async function AdminOrdersNewPage() {
  const [{ data: customers }, { data: contractors }] = await Promise.all([
    supabaseAdmin
      .from("customers")
      .select("id, name, phone")
      .order("name"),
    supabaseAdmin
      .from("contractors")
      .select("id, company_name")
      .eq("status", "ACTIVE")
      .order("company_name"),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1 text-xs text-muted hover:text-foreground transition-colors mb-2"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="m15 18-6-6 6-6" />
          </svg>
          案件一覧に戻る
        </Link>
        <h1 className="text-xl font-bold text-foreground">新規案件登録</h1>
      </div>

      <div className="rounded-lg border border-border bg-surface p-6 md:p-8 max-w-2xl">
        <OrderForm
          customers={(customers ?? []) as Array<{ id: string; name: string; phone: string }>}
          contractors={(contractors ?? []) as Array<{ id: string; company_name: string }>}
        />
      </div>
    </div>
  );
}
