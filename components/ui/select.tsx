import { cn } from "@/lib/cn";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export function Select({ error, children, className, ...props }: SelectProps) {
  return (
    <div className="relative">
      <select
        className={cn(
          "w-full appearance-none rounded border bg-surface px-3 py-2 pr-8 text-sm text-foreground",
          "transition-colors",
          "focus:border-ink focus:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error ? "border-danger" : "border-border",
          className
        )}
        {...props}
      >
        {children}
      </select>
      {/* chevron icon — Unicode only, no HEX values */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-muted"
      >
        ▾
      </span>
    </div>
  );
}
