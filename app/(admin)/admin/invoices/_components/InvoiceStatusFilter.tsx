import Link from "next/link";

const STATUSES = [
  { value: "",        label: "すべて" },
  { value: "UNPAID",  label: "未払い" },
  { value: "PARTIAL", label: "一部入金" },
  { value: "PAID",    label: "支払済" },
] as const;

const activeStyle  = { backgroundColor: "#1a1a1a", color: "#ffffff", border: "none" } as const;
const defaultStyle = { backgroundColor: "#f5f5f5", color: "#1a1a1a", border: "1px solid #e0e0e0" } as const;

export function InvoiceStatusFilter({ current }: { current: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      {STATUSES.map(({ value, label }) => (
        <Link
          key={value}
          href={value ? `/admin/invoices?status=${value}` : "/admin/invoices"}
          className="px-3 py-1.5 text-xs rounded-full transition-opacity hover:opacity-80"
          style={current === value ? activeStyle : defaultStyle}
        >
          {label}
        </Link>
      ))}
    </div>
  );
}
