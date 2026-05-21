import Link from "next/link";

const footerLinks = [
  { href: "/cases", label: "事例" },
  { href: "/contact", label: "お問い合わせ" },
  { href: "/apply", label: "業者登録" },
];

export function PublicFooter() {
  return (
    <footer className="bg-ink text-paper py-12 px-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <span className="font-serif font-bold tracking-tight text-paper">
          ServiceHub
        </span>

        <nav className="flex items-center gap-6" aria-label="フッターナビゲーション">
          {footerLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-xs text-paper/60 hover:text-paper transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>

        <span className="text-xs text-paper/60">
          © 2026 ServiceHub. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
