"use client";

import { cn } from "@/lib/cn";
import { Spinner } from "./spinner";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:   "bg-ink text-paper hover:bg-ink/80",
  secondary: "border border-border bg-surface text-foreground hover:bg-accent",
  danger:    "bg-danger text-paper hover:bg-danger/80",
  ghost:     "bg-transparent text-foreground hover:bg-accent",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "gap-1.5 px-3 py-1.5 text-xs",
  md: "gap-2 px-4 py-2 text-sm",
  lg: "gap-2 px-6 py-3 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  children,
  className,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <button
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={cn(
        "inline-flex items-center justify-center rounded font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40",
        "disabled:cursor-not-allowed disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  );
}
