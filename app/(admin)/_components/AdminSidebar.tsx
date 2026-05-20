import { cn } from "@/lib/cn";
import { SidebarLink } from "./SidebarLink";

const NAV_ITEMS = [
  { label: "ダッシュボード", href: "/admin" },
  { label: "問い合わせ", href: "/admin/inquiries" },
  { label: "案件", href: "/admin/orders" },
  { label: "顧客", href: "/admin/customers" },
  { label: "業者", href: "/admin/contractors" },
  { label: "請求", href: "/admin/invoices" },
  { label: "CMS", href: "/admin/cms" },
  { label: "設定", href: "/admin/settings" },
] as const;

interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  return (
    <aside
      className={cn(
        // Base — fixed on mobile, static on desktop
        "fixed inset-y-0 left-0 z-40 flex w-60 shrink-0 flex-col bg-ink text-paper",
        "transition-transform duration-200 ease-in-out",
        "lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:z-auto",
        open ? "translate-x-0" : "-translate-x-full"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center border-b border-paper/10 px-6">
        <span className="text-sm font-bold uppercase tracking-widest">
          ServiceHub
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-0.5" role="list">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <SidebarLink href={item.href} onClick={onClose}>
                {item.label}
              </SidebarLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
