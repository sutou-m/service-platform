import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

type Props = {
  title:        string;
  description?: string | null;
  content:      string;
  imageUrls:    string[];
  area?:        string | null;
  serviceType?: string | null;
  completedAt?: string | null;
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

export function CaseDetail({
  title,
  description,
  content,
  imageUrls,
  area,
  serviceType,
  completedAt,
}: Props) {
  return (
    <article className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      {/* 戻るリンク */}
      <Link
        href="/cases"
        className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition-colors mb-10"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
        事例一覧に戻る
      </Link>

      {/* メタ情報 */}
      {(serviceType || area || completedAt) && (
        <div className="flex flex-wrap gap-3 mb-4">
          {serviceType && (
            <span className="text-xs text-muted border border-border px-2 py-0.5 rounded-full">
              {serviceType}
            </span>
          )}
          {area && (
            <span className="text-xs text-muted border border-border px-2 py-0.5 rounded-full">
              {area}
            </span>
          )}
          {completedAt && (
            <span className="text-xs text-muted">完了：{formatDate(completedAt)}</span>
          )}
        </div>
      )}

      {/* タイトル */}
      <h1 className="font-serif text-3xl md:text-4xl tracking-tight text-ink mb-6">
        {title}
      </h1>

      {/* 概要 */}
      {description && (
        <p className="text-sm text-muted leading-relaxed mb-8 border-l-2 border-border pl-4">
          {description}
        </p>
      )}

      {/* 画像ギャラリー */}
      {imageUrls.length > 0 && (
        <div className="mb-10">
          {imageUrls.length === 1 ? (
            <div className="relative aspect-video w-full overflow-hidden">
              <Image
                src={imageUrls[0]}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
                priority
              />
            </div>
          ) : (
            <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory">
              {imageUrls.map((url, i) => (
                <div
                  key={url}
                  className="relative aspect-square w-64 shrink-0 overflow-hidden snap-start"
                >
                  <Image
                    src={url}
                    alt={`${title} ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="256px"
                    priority={i === 0}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 対応内容（Markdown） */}
      <div className="prose-case">
        <ReactMarkdown
          components={{
            h1: ({ children }) => <h2 className="text-2xl font-bold text-ink mt-8 mb-3">{children}</h2>,
            h2: ({ children }) => <h3 className="text-xl font-bold text-ink mt-7 mb-3">{children}</h3>,
            h3: ({ children }) => <h4 className="text-base font-bold text-ink mt-6 mb-2">{children}</h4>,
            p:  ({ children }) => <p className="text-sm text-foreground leading-relaxed mb-4">{children}</p>,
            ul: ({ children }) => <ul className="list-disc list-outside pl-5 mb-4 space-y-1 text-sm text-foreground">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal list-outside pl-5 mb-4 space-y-1 text-sm text-foreground">{children}</ol>,
            li: ({ children }) => <li className="leading-relaxed">{children}</li>,
            strong: ({ children }) => <strong className="font-semibold text-ink">{children}</strong>,
            em: ({ children }) => <em className="italic">{children}</em>,
            hr: () => <hr className="my-6 border-border" />,
            blockquote: ({ children }) => (
              <blockquote className="border-l-2 border-border pl-4 my-4 text-sm text-muted italic">
                {children}
              </blockquote>
            ),
            code: ({ children }) => (
              <code className="bg-accent px-1.5 py-0.5 rounded text-xs font-mono text-foreground">
                {children}
              </code>
            ),
            pre: ({ children }) => (
              <pre className="bg-accent rounded p-4 overflow-x-auto text-xs font-mono mb-4">
                {children}
              </pre>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </article>
  );
}
