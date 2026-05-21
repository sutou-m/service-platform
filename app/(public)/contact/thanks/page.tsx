import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "送信完了 | ServiceHub",
};

export default function ContactThanksPage() {
  return (
    <div className="bg-paper min-h-screen flex items-center justify-center px-6 py-16">
      <div className="mx-auto max-w-md text-center">
        {/* アイコン */}
        <div className="mb-8 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-ink"
              aria-hidden="true"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
        </div>

        {/* メッセージ */}
        <h1 className="font-serif text-2xl md:text-3xl tracking-tight text-ink mb-4">
          お問い合わせを受け付けました
        </h1>
        <p className="text-sm text-muted leading-relaxed mb-10">
          ご連絡いただきありがとうございます。
          <br />
          担当者より1〜2営業日以内にご連絡いたします。
          <br />
          しばらくお待ちください。
        </p>

        {/* トップへ戻る */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium tracking-[0.1em] px-8 py-3 transition-opacity hover:opacity-75"
          style={{ backgroundColor: "#1a1a1a", color: "#ffffff" }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          トップへ戻る
        </Link>
      </div>
    </div>
  );
}
