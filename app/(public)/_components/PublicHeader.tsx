"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { MobileMenu } from "./MobileMenu";

const navLinks = [
  { href: "/cases", label: "事例" },
  { href: "/#services", label: "サービス" },
  { href: "/#faq", label: "よくある質問" },
];

export function PublicHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b transition-colors duration-200 ${
          scrolled
            ? "bg-surface/90 backdrop-blur-sm border-border"
            : "bg-surface border-transparent"
        }`}
      >
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* ロゴ */}
          <Link
            href="/"
            className="font-serif font-bold tracking-tight text-lg text-foreground"
          >
            ServiceHub
          </Link>

          {/* デスクトップナビ */}
          <nav
            className="hidden md:flex items-center gap-8"
            aria-label="グローバルナビゲーション"
          >
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm text-muted hover:text-foreground transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {/* CTA（デスクトップ） */}
            <Link
              href="/contact"
              className="hidden md:inline-flex items-center justify-center text-sm font-medium px-5 py-2 transition-opacity hover:opacity-75"
              style={{ backgroundColor: '#1a1a1a', color: '#ffffff' }}
            >
              無料相談
            </Link>

            {/* ハンバーガー（モバイル） */}
            <button
              className="md:hidden p-2 text-foreground hover:text-muted transition-colors"
              aria-label="メニューを開く"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
