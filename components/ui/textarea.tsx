import { cn } from "@/lib/cn";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export function Textarea({ error, className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        "w-full resize-y rounded border bg-surface px-3 py-2 text-sm text-foreground",
        "min-h-24",
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
