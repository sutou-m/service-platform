import { cn } from "@/lib/cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export function Input({ error, className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "w-full rounded border bg-surface px-3 py-2 text-sm text-foreground",
        "placeholder:text-muted",
        "transition-colors",
        "focus:border-ink focus:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-50",
        error ? "border-danger" : "border-border",
        className
      )}
      {...props}
    />
  );
}
