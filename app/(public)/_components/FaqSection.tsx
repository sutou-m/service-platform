import { FAQ_ITEMS } from "@/lib/data/faq";

export function FaqSection() {
  return (
    <section id="faq" className="bg-paper py-20 md:py-32 px-6">
      <div className="max-w-3xl mx-auto">
        <p className="text-xs font-medium tracking-[0.3em] uppercase text-muted mb-4">
          FAQ
        </p>
        <h2 className="font-serif text-3xl md:text-4xl tracking-tight mb-16">
          よくある質問
        </h2>

        <dl className="divide-y divide-border border-t border-border">
          {FAQ_ITEMS.map((item) => (
            <details key={item.question} className="group">
              <summary className="flex cursor-pointer items-center justify-between gap-6 py-5 text-left text-base font-medium list-none">
                <span>{item.question}</span>
                <span
                  aria-hidden="true"
                  className="shrink-0 text-muted transition-transform duration-200 group-open:rotate-180"
                >
                  ↓
                </span>
              </summary>
              <div className="pb-6 text-sm text-muted leading-relaxed">
                {item.answer}
              </div>
            </details>
          ))}
        </dl>
      </div>
    </section>
  );
}
