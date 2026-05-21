import Image from "next/image";
import Link from "next/link";

type Props = {
  id:          string;
  title:       string;
  area?:       string | null;
  completedAt?: string | null;
  imageUrl?:   string | null;
  size?:       "large" | "small";
};

function formatMonth(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}年${d.getMonth() + 1}月`;
}

export function CaseCard({ id, title, area, completedAt, imageUrl, size = "small" }: Props) {
  return (
    <Link href={`/cases/${id}`} className="group block">
      {/* サムネイル */}
      <div className="relative aspect-square overflow-hidden bg-accent">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes={
              size === "large"
                ? "(max-width: 768px) 100vw, 66vw"
                : "(max-width: 768px) 100vw, 33vw"
            }
          />
        ) : (
          <div className="h-full w-full bg-accent" />
        )}
      </div>

      {/* テキスト */}
      <div className="pt-3 pb-4">
        {(area || completedAt) && (
          <p className="text-xs text-muted mb-1">
            {[area, completedAt ? formatMonth(completedAt) : null]
              .filter(Boolean)
              .join(" · ")}
          </p>
        )}
        <h3
          className={[
            "font-medium text-foreground leading-snug line-clamp-2",
            size === "large" ? "text-base" : "text-sm",
          ].join(" ")}
        >
          {title}
        </h3>
      </div>
    </Link>
  );
}
