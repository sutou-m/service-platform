"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

interface ContractorSidebarLinkProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export function ContractorSidebarLink({
  href,
  children,
  onClick,
}: ContractorSidebarLinkProps) {
  const pathname = usePathname();

  // トップの案件一覧は完全一致、それ以外はプレフィックス一致
  const isActive =
    href === "/contractor" ? pathname === "/contractor" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "block rounded px-3 py-2 text-sm font-medium transition-colors",
        isActive
          ? "bg-accent text-ink"
          : "text-muted hover:bg-accent hover:text-ink"
      )}
    >
      {children}
    </Link>
  );
}
