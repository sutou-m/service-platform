import type { Metadata } from "next";
import { ApplyForm } from "./_components/ApplyForm";

export const metadata: Metadata = {
  title: "業者登録申請 | ServiceHub",
  description: "ServiceHubへの業者登録申請フォームです。審査後、登録メールアドレスにご連絡します。",
};

export default function ApplyPage() {
  return (
    <div className="bg-paper min-h-screen px-6 py-16 md:py-24">
      <div className="mx-auto max-w-xl">
        <div className="mb-12">
          <p className="text-xs font-medium tracking-[0.3em] uppercase text-muted mb-3">
            Partner Registration
          </p>
          <h1 className="font-serif text-3xl md:text-4xl tracking-tight text-ink mb-4">
            業者登録申請
          </h1>
          <p className="text-sm text-muted leading-relaxed">
            必要事項をご入力の上、申請してください。内容を審査後、登録メールアドレスにご連絡します。
          </p>
        </div>

        <div className="rounded-none border border-border bg-surface p-8 md:p-10">
          <ApplyForm />
        </div>
      </div>
    </div>
  );
}
