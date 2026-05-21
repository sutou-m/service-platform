import Image from "next/image";
import { cn } from "@/lib/cn";

interface CmsPost {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  image_urls: string[];
  area: string | null;
  service_type: string | null;
}

interface CasesGridProps {
  posts: CmsPost[];
}

export function CasesGrid({ posts }: CasesGridProps) {
  return (
    <section className="bg-paper py-20 md:py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <p className="text-xs font-medium tracking-[0.3em] uppercase text-muted mb-4">
          Cases
        </p>
        <h2 className="font-serif text-3xl md:text-4xl tracking-tight mb-12">
          施工事例
        </h2>

        {posts.length === 0 ? (
          <div className="border border-border py-20 text-center">
            <p className="text-muted text-sm">事例を準備中です。</p>
          </div>
        ) : (
          <>
            {/* BRUTUS-style asymmetric grid: alternates large-left / large-right per pair */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
              {posts.slice(0, 6).map((post, i) => {
                const pairIndex = Math.floor(i / 2);
                const posInPair = i % 2;
                // Odd pairs flip the layout: small then large
                const isLarge =
                  pairIndex % 2 === 0 ? posInPair === 0 : posInPair === 1;

                return (
                  <a
                    key={post.id}
                    href={`/cases/${post.id}`}
                    className={cn(
                      "group relative overflow-hidden bg-accent",
                      isLarge ? "md:col-span-2" : "md:col-span-1"
                    )}
                  >
                    <div className="relative w-full aspect-square overflow-hidden">
                      {post.image_urls[0] ? (
                        <Image
                          src={post.image_urls[0]}
                          alt={post.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 66vw, 800px"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="w-full h-full bg-accent" />
                      )}

                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/25 transition-colors duration-300" />

                      {/* Caption */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-ink/70 to-transparent">
                        {post.area && (
                          <p className="text-paper/70 text-xs mb-0.5">{post.area}</p>
                        )}
                        <p className="text-paper text-sm font-medium leading-snug line-clamp-2">
                          {post.title}
                        </p>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>

            <div className="mt-8 flex justify-end">
              <a
                href="/cases"
                className="text-sm tracking-widest uppercase underline underline-offset-4 text-muted hover:text-ink transition-colors"
              >
                すべて見る
              </a>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
