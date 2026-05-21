"use client";

import { useRouter } from "next/navigation";
import {
  Table, Thead, Tbody, Tr, Th, Td,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { BadgeVariant } from "@/components/ui/badge";

type InvoiceRow = {
  id:           string;
  total_amount: number;
  status:       string;
  issue_date:   string;
  due_date:     string | null;
  customers:    { name: string } | null;
};

const STATUS_CONFIG: Record<string, { label: string; variant: BadgeVariant }> = {
  UNPAID:  { label: "未払い",   variant: "danger"  },
  PARTIAL: { label: "一部入金", variant: "warning" },
  PAID:    { label: "支払済",   variant: "success" },
};

export function InvoiceTable({ invoices }: { invoices: InvoiceRow[] }) {
  const router = useRouter();

  if (invoices.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-muted">
        該当する請求書はありません
      </p>
    );
  }

  return (
    <Table>
      <Thead>
        <Tr>
          <Th>請求番号</Th>
          <Th>顧客名</Th>
          <Th className="hidden sm:table-cell text-right">金額</Th>
          <Th>ステータス</Th>
          <Th className="hidden md:table-cell">発行日</Th>
          <Th className="hidden lg:table-cell">支払期限</Th>
        </Tr>
      </Thead>
      <Tbody>
        {invoices.map((inv) => {
          const sc = STATUS_CONFIG[inv.status] ?? { label: inv.status, variant: "default" as BadgeVariant };
          return (
            <Tr
              key={inv.id}
              onClick={() => router.push(`/admin/invoices/${inv.id}`)}
            >
              <Td className="font-mono text-xs font-medium">
                #{inv.id.slice(0, 8).toUpperCase()}
              </Td>
              <Td className="font-medium">{inv.customers?.name ?? "—"}</Td>
              <Td className="hidden sm:table-cell text-right tabular-nums font-medium">
                ¥{inv.total_amount.toLocaleString("ja-JP")}
              </Td>
              <Td>
                <Badge variant={sc.variant}>{sc.label}</Badge>
              </Td>
              <Td className="hidden md:table-cell text-muted whitespace-nowrap">
                {new Date(inv.issue_date).toLocaleDateString("ja-JP")}
              </Td>
              <Td className="hidden lg:table-cell text-muted whitespace-nowrap">
                {inv.due_date ? new Date(inv.due_date).toLocaleDateString("ja-JP") : "—"}
              </Td>
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
}
