import Image from "next/image";
import { cn } from "@/lib/cn";

interface AvatarProps {
  src?: string | null;
  name?: string;
  alt?: string;
  size?: number;
  className?: string;
}

function getInitials(name: string): string {
  // Handle CJK names (no spaces) by taking up to 2 chars, otherwise take first letter of each word
  const words = name.split(/[\s　]+/).filter(Boolean);
  if (words.length === 1) {
    return name.slice(0, 2).toUpperCase();
  }
  return words
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function Avatar({ src, name, alt, size = 40, className }: AvatarProps) {
  const initials = name ? getInitials(name) : "?";
  const label = alt ?? name ?? "";

  return (
    <div
      role="img"
      aria-label={label}
      style={{ width: size, height: size, fontSize: size * 0.35 }}
      className={cn(
        "relative shrink-0 overflow-hidden rounded",
        !src && "flex items-center justify-center bg-accent",
        className
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={label}
          fill
          className="object-cover"
          sizes={`${size}px`}
        />
      ) : (
        <span
          className="select-none font-medium text-ink"
          aria-hidden="true"
        >
          {initials}
        </span>
      )}
    </div>
  );
}
