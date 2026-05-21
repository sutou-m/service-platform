import type { Metadata } from "next";
import { ContactForm } from "./_components/ContactForm";

export const metadata: Metadata = {
  title: "無料相談・お問い合わせ | ServiceHub",
  description: "リフォーム・清掃・引越しなど、暮らしのサービスに関するご相談・お見積りはこちらから。",
};

export default function ContactPage() {
  return (
    <div className="bg-paper min-h-screen px-6 py-16 md:py-24">
      <div className="mx-auto max-w-xl">
        {/* ページタイトル */}
        <div className="mb-12">
          <p className="text-xs font-medium tracking-[0.3em] uppercase text-muted mb-3">
            Contact
          </p>
          <h1 className="font-serif text-3xl md:text-4xl tracking-tight text-ink mb-4">
            無料相談・お問い合わせ
          </h1>
          <p className="text-sm text-muted leading-relaxed">
            ご相談内容をお知らせください。担当者より1〜2営業日以内にご連絡いたします。
          </p>
        </div>

        {/* フォーム */}
        <div className="rounded-none border border-border bg-surface p-8 md:p-10">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
