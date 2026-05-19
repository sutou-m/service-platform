import { cn } from "@/lib/cn";

type SpinnerSize = "sm" | "md" | "lg";

const sizeClasses: Record<SpinnerSize, string> = {
  sm: "w-4 h-4 border-2",
  md: "w-6 h-6 border-2",
  lg: "w-8 h-8 border-[3px]",
};

interface SpinnerProps {
  size?: SpinnerSize;
  className?: string;
}

export function Spinner({ size = "md", className }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="読み込み中"
      className={cn(
        "inline-block rounded-full border-border border-t-ink animate-spin",
        sizeClasses[size],
        className
      )}
    />
  );
}
