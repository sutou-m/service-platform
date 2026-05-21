"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

interface ContractorHeaderProps {
  userName: string;
  onMenuClick: () => void;
}

export function ContractorHeader({ userName, onMenuClick }: ContractorHeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-surface px-4 lg:px-6">
      {/* ハンバーガー（モバイルのみ） */}
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="メニューを開く"
        className="rounded p-2 text-muted transition-colors hover:bg-accent hover:text-ink lg:hidden"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <rect y="3.5" width="20" height="1.5" rx="0.75" fill="currentColor" />
          <rect y="9.25" width="20" height="1.5" rx="0.75" fill="currentColor" />
          <rect y="15" width="20" height="1.5" rx="0.75" fill="currentColor" />
        </svg>
      </button>

      {/* デスクトップ：右寄せのスペーサー */}
      <div className="hidden lg:block" />

      {/* 業者名 ＋ ログアウト */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted">{userName}</span>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => signOut({ callbackUrl: "/contractor/login" })}
        >
          ログアウト
        </Button>
      </div>
    </header>
  );
}
