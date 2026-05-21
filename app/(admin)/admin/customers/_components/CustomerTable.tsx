"use client";

import { useRouter } from "next/navigation";
import {
  Table, Thead, Tbody, Tr, Th, Td,
} from "@/components/ui/table";

type CustomerRow = {
  id:         string;
  name:       string;
  phone:      string;
  email:      string;
  created_at: string;
};

export function CustomerTable({ customers }: { customers: CustomerRow[] }) {
  const router = useRouter();

  if (customers.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-muted">
        該当する顧客はありません
      </p>
    );
  }

  return (
    <Table>
      <Thead>
        <Tr>
          <Th>氏名</Th>
          <Th className="hidden sm:table-cell">電話番号</Th>
          <Th className="hidden md:table-cell">メール</Th>
          <Th className="hidden sm:table-cell">登録日</Th>
        </Tr>
      </Thead>
      <Tbody>
        {customers.map((c) => (
          <Tr
            key={c.id}
            onClick={() => router.push(`/admin/customers/${c.id}`)}
          >
            <Td className="font-medium">{c.name}</Td>
            <Td className="hidden sm:table-cell text-muted">{c.phone}</Td>
            <Td className="hidden md:table-cell text-muted">{c.email}</Td>
            <Td className="hidden sm:table-cell text-muted whitespace-nowrap">
              {new Date(c.created_at).toLocaleDateString("ja-JP")}
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}
