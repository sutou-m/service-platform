import { cn } from "@/lib/cn";

type AlertVariant = "default" | "success" | "warning" | "danger" | "info";

interface AlertProps {
  variant?: AlertVariant;
  icon?: React.ReactNode;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<AlertVariant, string> = {
  default: "border-border bg-accent/40 text-foreground",
  success: "border-success/30 bg-success/10 text-success",
  warning: "border-warning/30 bg-warning/10 text-warning",
  danger:  "border-danger/30 bg-danger/10 text-danger",
  info:    "border-info/30 bg-info/10 text-info",
};

export function Alert({
  variant = "default",
  icon,
  title,
  children,
  className,
}: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex gap-3 rounded border px-4 py-3 text-sm",
        variantClasses[variant],
        className
      )}
    >
      {icon && (
        <span className="mt-0.5 shrink-0" aria-hidden="true">
          {icon}
        </span>
      )}
      <div>
        {title && <p className="mb-1 font-medium">{title}</p>}
        {children}
      </div>
    </div>
  );
}
