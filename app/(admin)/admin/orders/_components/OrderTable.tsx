"use client";

import { useRouter } from "next/navigation";
import {
  Table, Thead, Tbody, Tr, Th, Td,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import type { OrderStatus } from "@/components/ui/status-badge";

type OrderRow = {
  id:           string;
  status:       string;
  work_at:      string | null;
  created_at:   string;
  work_content: string;
  customers:    { name: string } | null;
  contractors:  { company_name: string } | null;
};

export function OrderTable({ orders }: { orders: OrderRow[] }) {
  const router = useRouter();

  if (orders.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-muted">
        該当する案件はありません
      </p>
    );
  }

  return (
    <Table>
      <Thead>
        <Tr>
          <Th>案件番号</Th>
          <Th>顧客名</Th>
          <Th className="hidden md:table-cell">作業内容</Th>
          <Th>ステータス</Th>
          <Th className="hidden lg:table-cell">担当業者</Th>
          <Th className="hidden sm:table-cell">作業予定日</Th>
          <Th className="hidden sm:table-cell">作成日</Th>
        </Tr>
      </Thead>
      <Tbody>
        {orders.map((order) => (
          <Tr
            key={order.id}
            onClick={() => router.push(`/admin/orders/${order.id}`)}
          >
            <Td className="font-mono text-xs font-medium">
              {order.id.slice(0, 8).toUpperCase()}
            </Td>
            <Td className="font-medium">
              {order.customers?.name ?? "—"}
            </Td>
            <Td className="hidden md:table-cell max-w-xs">
              <span className="line-clamp-1 text-muted">{order.work_content}</span>
            </Td>
            <Td>
              <StatusBadge status={order.status as OrderStatus} />
            </Td>
            <Td className="hidden lg:table-cell text-muted">
              {order.contractors?.company_name ?? "未割当"}
            </Td>
            <Td className="hidden sm:table-cell text-muted whitespace-nowrap">
              {order.work_at
                ? new Date(order.work_at).toLocaleDateString("ja-JP")
                : "—"}
            </Td>
            <Td className="hidden sm:table-cell text-muted whitespace-nowrap">
              {new Date(order.created_at).toLocaleDateString("ja-JP")}
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}
