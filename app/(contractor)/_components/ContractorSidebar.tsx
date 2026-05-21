import { cn } from "@/lib/cn";
import { ContractorSidebarLink } from "./ContractorSidebarLink";

const NAV_ITEMS = [
  { label: "案件一覧", href: "/contractor" },
  { label: "自社情報", href: "/contractor/profile" },
] as const;

interface ContractorSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function ContractorSidebar({ open, onClose }: ContractorSidebarProps) {
  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex w-56 shrink-0 flex-col",
        "bg-surface border-r border-border",
        "transition-transform duration-200 ease-in-out",
        "lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:z-auto",
        open ? "translate-x-0" : "-translate-x-full"
      )}
    >
      {/* ロゴ */}
      <div className="flex h-16 shrink-0 items-center border-b border-border px-6">
        <span className="text-sm font-bold tracking-widest uppercase text-foreground">
          ServiceHub
        </span>
      </div>

      {/* ナビゲーション */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-0.5" role="list">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <ContractorSidebarLink href={item.href} onClick={onClose}>
                {item.label}
              </ContractorSidebarLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
