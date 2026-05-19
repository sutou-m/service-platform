"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

interface SidebarLinkProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export function SidebarLink({ href, children, onClick }: SidebarLinkProps) {
  const pathname = usePathname();

  // Exact match for top-level dashboard, prefix match for everything else
  const isActive =
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "block rounded px-3 py-2 text-sm font-medium transition-colors",
        isActive
          ? ""
          : "bg-transparent text-[#ffffff] hover:bg-[rgba(255,255,255,0.15)] hover:text-[#ffffff]"
      )}
      style={
        isActive
          ? { backgroundColor: "#ffffff", color: "#1a1a1a", borderRadius: "4px" }
          : undefined
      }
    >
      {children}
    </Link>
  );
}
