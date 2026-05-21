"use client";

import { useRouter } from "next/navigation";
import {
  Table, Thead, Tbody, Tr, Th, Td,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type ContractorRow = {
  id:            string;
  company_name:  string;
  owner_name:    string;
  phone:         string;
  email:         string;
  status:        string;
  areas:         string[];
  created_at:    string;
};

const statusConfig: Record<string, { label: string; variant: "success" | "default" | "warning" }> = {
  ACTIVE:   { label: "稼働中", variant: "success" },
  INACTIVE: { label: "停止中", variant: "default" },
  PENDING:  { label: "審査中", variant: "warning" },
};

export function ContractorTable({ contractors }: { contractors: ContractorRow[] }) {
  const router = useRouter();

  if (contractors.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-muted">
        該当する業者はありません
      </p>
    );
  }

  return (
    <Table>
      <Thead>
        <Tr>
          <Th>会社名</Th>
          <Th className="hidden sm:table-cell">代表者</Th>
          <Th className="hidden md:table-cell">電話番号</Th>
          <Th className="hidden lg:table-cell">対応エリア</Th>
          <Th>ステータス</Th>
          <Th className="hidden sm:table-cell">登録日</Th>
        </Tr>
      </Thead>
      <Tbody>
        {contractors.map((c) => {
          const sc = statusConfig[c.status] ?? { label: c.status, variant: "default" as const };
          return (
            <Tr key={c.id} onClick={() => router.push(`/admin/contractors/${c.id}`)}>
              <Td className="font-medium">{c.company_name}</Td>
              <Td className="hidden sm:table-cell text-muted">{c.owner_name}</Td>
              <Td className="hidden md:table-cell text-muted">{c.phone}</Td>
              <Td className="hidden lg:table-cell text-muted">
                <span className="line-clamp-1 text-xs">
                  {c.areas.length > 0 ? c.areas.slice(0, 3).join("・") + (c.areas.length > 3 ? "…" : "") : "—"}
                </span>
              </Td>
              <Td>
                <Badge variant={sc.variant}>{sc.label}</Badge>
              </Td>
              <Td className="hidden sm:table-cell text-muted whitespace-nowrap">
                {new Date(c.created_at).toLocaleDateString("ja-JP")}
              </Td>
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
}
