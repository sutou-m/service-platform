"use client";

import { useState } from "react";
import { ContractorSidebar } from "./ContractorSidebar";
import { ContractorHeader } from "./ContractorHeader";

interface ContractorShellProps {
  children: React.ReactNode;
  userName: string;
}

export function ContractorShell({ children, userName }: ContractorShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex">
      {/* モバイルオーバーレイ */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-ink/50 lg:hidden"
          aria-hidden="true"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <ContractorSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <ContractorHeader
          userName={userName}
          onMenuClick={() => setSidebarOpen((v) => !v)}
        />
        <main className="flex-1 bg-background p-6 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
