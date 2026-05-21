"use client";

import Link from "next/link";
import { useEffect } from "react";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

const navLinks = [
  { href: "/cases", label: "事例" },
  { href: "/#services", label: "サービス" },
  { href: "/#faq", label: "よくある質問" },
];

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  // スクロールロック
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex flex-col bg-surface"
      aria-label="メニュー"
      role="dialog"
      aria-modal="true"
    >
      {/* ヘッダー行（閉じるボタン） */}
      <div className="h-16 flex items-center justify-end px-6 border-b border-border">
        <button
          onClick={onClose}
          className="p-2 text-foreground hover:text-muted transition-colors"
          aria-label="メニューを閉じる"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* ナビリンク */}
      <nav className="flex flex-col px-8 py-10 gap-2">
        {navLinks.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            onClick={onClose}
            className="text-2xl font-serif text-foreground py-4 border-b border-border hover:text-muted transition-colors"
          >
            {label}
          </Link>
        ))}
      </nav>

      {/* CTA */}
      <div className="px-8 mt-4">
        <Link
          href="/contact"
          onClick={onClose}
          className="block w-full text-center bg-ink text-paper font-medium py-4 text-base hover:bg-ink/80 transition-colors"
        >
          無料相談
        </Link>
      </div>
    </div>
  );
}
