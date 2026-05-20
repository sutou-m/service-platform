export function ContractorCta() {
  return (
    <section className="bg-accent text-ink py-20 md:py-24 px-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="max-w-lg">
          <p className="text-xs font-medium tracking-[0.3em] uppercase text-muted mb-4">
            For Contractors
          </p>
          <h2 className="font-serif text-3xl md:text-4xl tracking-tight mb-3">
            業者として参加しませんか
          </h2>
          <p className="text-sm text-muted leading-relaxed">
            あなたのスキルと経験を活かして、多くのお客様をサポートできます。
            <br />
            登録は無料です。
          </p>
        </div>

        <a
          href="/apply"
          className="shrink-0 inline-flex items-center gap-3 px-8 py-4 text-sm font-medium tracking-[0.15em] uppercase transition-opacity hover:opacity-75"
          style={{ backgroundColor: "#1a1a1a", color: "#ffffff" }}
        >
          業者登録はこちら
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  );
}
