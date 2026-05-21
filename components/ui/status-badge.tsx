import { Badge } from "./badge";
import type { BadgeVariant } from "./badge";

export type InquiryStatus = "NEW" | "CONVERTED" | "CLOSED";

const INQUIRY_STATUS_CONFIG: Record<InquiryStatus, { label: string; variant: BadgeVariant }> = {
  NEW:       { label: "新規",    variant: "info" },
  CONVERTED: { label: "案件化済", variant: "success" },
  CLOSED:    { label: "クローズ", variant: "default" },
};

export function InquiryStatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const config = INQUIRY_STATUS_CONFIG[status as InquiryStatus] ?? {
    label: status,
    variant: "default" as BadgeVariant,
  };
  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  );
}

export type OrderStatus =
  | "NEW"
  | "VISIT_SCHEDULING"
  | "WORK_SCHEDULED"
  | "WORKING"
  | "WORK_DONE"
  | "INVOICED"
  | "PAID"
  | "CLOSED";

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; variant: BadgeVariant }
> = {
  NEW:              { label: "新規",       variant: "info" },
  VISIT_SCHEDULING: { label: "訪問調整中", variant: "default" },
  WORK_SCHEDULED:   { label: "作業予定",   variant: "info" },
  WORKING:          { label: "作業中",     variant: "warning" },
  WORK_DONE:        { label: "作業完了",   variant: "success" },
  INVOICED:         { label: "請求済",     variant: "default" },
  PAID:             { label: "入金済",     variant: "success" },
  CLOSED:           { label: "クローズ",   variant: "default" },
};

interface StatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? {
    label: status,
    variant: "default" as BadgeVariant,
  };
  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  );
}
