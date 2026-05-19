import { cn } from "@/lib/cn";

interface CardProps {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}

export function Card({
  header,
  footer,
  children,
  className,
  bodyClassName,
}: CardProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-border bg-surface",
        className
      )}
    >
      {header && (
        <div className="border-b border-border px-6 py-4">{header}</div>
      )}
      <div className={cn("px-6 py-4", bodyClassName)}>{children}</div>
      {footer && (
        <div className="border-t border-border bg-background px-6 py-4">
          {footer}
        </div>
      )}
    </div>
  );
}
