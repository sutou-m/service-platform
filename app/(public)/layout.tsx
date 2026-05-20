import Link from "next/link";
import { Noto_Serif_JP, Noto_Sans_JP } from "next/font/google";

const notoSerifJP = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-noto-serif",
  display: "swap",
});

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans",
  display: "swap",
});

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${notoSerifJP.variable} ${notoSansJP.variable} flex flex-col min-h-screen`}>
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-paper border-b border-border">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="font-serif font-bold tracking-tight text-lg text-ink"
          >
            ServiceHub
          </Link>

          <nav className="hidden md:flex items-center gap-8" aria-label="グローバルナビゲーション">
            <Link
              href="/cases"
              className="text-sm text-muted hover:text-ink transition-colors"
            >
              事例
            </Link>
            <Link
              href="/#services"
              className="text-sm text-muted hover:text-ink transition-colors"
            >
              サービス
            </Link>
            <Link
              href="/#faq"
              className="text-sm text-muted hover:text-ink transition-colors"
            >
              よくある質問
            </Link>
          </nav>

          <Link
            href="/contact"
            className="text-sm px-5 py-2 hover:opacity-75 transition-opacity"
            style={{ backgroundColor: "#1a1a1a", color: "#ffffff" }}
          >
            無料相談
          </Link>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border bg-paper py-12 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-serif font-bold tracking-tight text-ink">
            ServiceHub
          </span>
          <nav className="flex items-center gap-6" aria-label="フッターナビゲーション">
            <Link href="/cases" className="text-xs text-muted hover:text-ink transition-colors">
              事例
            </Link>
            <Link href="/contact" className="text-xs text-muted hover:text-ink transition-colors">
              お問い合わせ
            </Link>
            <Link href="/apply" className="text-xs text-muted hover:text-ink transition-colors">
              業者登録
            </Link>
          </nav>
          <span className="text-xs text-muted">
            © 2026 ServiceHub. All rights reserved.
          </span>
        </div>
      </footer>
    </div>
  );
}
