"use client";

import { useRouter } from "next/navigation";
import {
  Table, Thead, Tbody, Tr, Th, Td,
} from "@/components/ui/table";
import { InquiryStatusBadge } from "@/components/ui/status-badge";

type Inquiry = {
  id:           string;
  name:         string;
  phone:        string;
  work_content: string;
  created_at:   string;
  status:       string;
};

export function InquiryTable({ inquiries }: { inquiries: Inquiry[] }) {
  const router = useRouter();

  if (inquiries.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-muted">
        該当する問い合わせはありません
      </p>
    );
  }

  return (
    <Table>
      <Thead>
        <Tr>
          <Th>氏名</Th>
          <Th>電話番号</Th>
          <Th className="hidden md:table-cell">希望作業内容</Th>
          <Th className="hidden sm:table-cell">受付日時</Th>
          <Th>ステータス</Th>
        </Tr>
      </Thead>
      <Tbody>
        {inquiries.map((inq) => (
          <Tr
            key={inq.id}
            onClick={() => router.push(`/admin/inquiries/${inq.id}`)}
          >
            <Td className="font-medium">{inq.name}</Td>
            <Td className="text-muted">{inq.phone}</Td>
            <Td className="hidden md:table-cell max-w-xs">
              <span className="line-clamp-1 text-muted">{inq.work_content}</span>
            </Td>
            <Td className="hidden sm:table-cell text-muted whitespace-nowrap">
              {new Date(inq.created_at).toLocaleDateString("ja-JP")}
            </Td>
            <Td>
              <InquiryStatusBadge status={inq.status} />
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}
