export function HeroSection() {
  return (
    <section className="bg-paper text-ink py-24 md:py-40 px-6">
      <div className="max-w-5xl mx-auto">
        <p className="text-xs font-medium tracking-[0.3em] uppercase text-muted mb-8">
          Home Service Platform
        </p>

        <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight mb-8">
          依頼から完了まで、ひとつの場所で。
        </h1>

        <p className="text-base md:text-lg text-muted max-w-lg mb-12 leading-relaxed">
          リフォーム・清掃・引越しなど、暮らしのサービスを信頼できる専門業者に簡単に依頼できます。
        </p>

        <a
          href="/contact"
          className="inline-flex items-center gap-3 px-8 py-4 text-sm font-medium tracking-[0.15em] uppercase transition-opacity hover:opacity-75"
          style={{ backgroundColor: "#1a1a1a", color: "#ffffff" }}
        >
          無料で相談する
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  );
}
