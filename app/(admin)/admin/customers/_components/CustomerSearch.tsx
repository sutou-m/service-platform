"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

type Props = { q: string };

export function CustomerSearch({ q }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState(q);

  useEffect(() => { setSearch(q); }, [q]);

  const btnBase: React.CSSProperties = {
    display:      "inline-flex",
    alignItems:   "center",
    height:       "40px",
    padding:      "0 16px",
    borderRadius: "4px",
    fontSize:     "14px",
    fontWeight:   500,
    whiteSpace:   "nowrap",
    cursor:       "pointer",
    border:       "none",
  };

  return (
    <form
      className="flex gap-2 items-center"
      onSubmit={(e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (search) params.set("q", search);
        router.push(`/admin/customers${params.size > 0 ? `?${params}` : ""}`);
      }}
    >
      <Input
        type="search"
        placeholder="顧客名・メールで検索"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-64"
        style={{ height: "40px" }}
      />
      <button
        type="submit"
        style={{ ...btnBase, backgroundColor: "#1a1a1a", color: "#ffffff" }}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.8"; }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
      >
        検索
      </button>
      {q !== "" && (
        <button
          type="button"
          style={{
            ...btnBase,
            backgroundColor: "#ffffff",
            color:           "#1a1a1a",
            border:          "1px solid #e0e0e0",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#f5f5f5"; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#ffffff"; }}
          onClick={() => {
            setSearch("");
            router.push("/admin/customers");
          }}
        >
          クリア
        </button>
      )}
    </form>
  );
}
