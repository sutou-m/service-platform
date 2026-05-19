import { cn } from "@/lib/cn";

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}

export function Label({
  htmlFor,
  required,
  children,
  className,
  ...props
}: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn("block text-sm font-medium text-foreground", className)}
      {...props}
    >
      {children}
      {required && (
        <span className="ml-1 text-danger" aria-hidden="true">
          *
        </span>
      )}
    </label>
  );
}
