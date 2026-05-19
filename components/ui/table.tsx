import { cn } from "@/lib/cn";

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

export function Table({ children, className }: TableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table
        className={cn("w-full border-collapse text-sm text-foreground", className)}
      >
        {children}
      </table>
    </div>
  );
}

export function Thead({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <thead className={cn("border-b border-border", className)}>
      {children}
    </thead>
  );
}

export function Tbody({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <tbody className={className}>{children}</tbody>;
}

interface TrProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Tr({ children, className, onClick }: TrProps) {
  return (
    <tr
      onClick={onClick}
      className={cn(
        "border-b border-border transition-colors last:border-0",
        onClick && "cursor-pointer hover:bg-accent/30",
        className
      )}
    >
      {children}
    </tr>
  );
}

export function Th({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      scope="col"
      className={cn(
        "px-4 py-3 text-left text-xs font-medium tracking-wide text-muted",
        className
      )}
    >
      {children}
    </th>
  );
}

export function Td({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <td className={cn("px-4 py-4 align-middle", className)}>{children}</td>
  );
}
