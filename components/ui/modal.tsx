"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({
  open,
  onClose,
  title,
  children,
  className,
}: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open) {
      if (!dialog.open) dialog.showModal();
    } else {
      if (dialog.open) dialog.close();
    }
  }, [open]);

  function handleClick(e: React.MouseEvent<HTMLDialogElement>) {
    // Close when clicking directly on the backdrop (dialog element itself)
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={handleClick}
      className={cn(
        "m-auto max-h-[90dvh] w-full max-w-lg overflow-hidden rounded-lg border border-border",
        "bg-surface p-0 shadow-xl",
        "open:flex open:flex-col",
        className
      )}
    >
      {title && (
        <div className="flex shrink-0 items-center justify-between border-b border-border px-6 py-4">
          <h2 className="font-sans text-base font-semibold text-foreground">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="閉じる"
            className="text-muted transition-colors hover:text-foreground"
          >
            ✕
          </button>
        </div>
      )}
      <div className="overflow-y-auto px-6 py-4">{children}</div>
    </dialog>
  );
}
