"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Select } from "@/components/ui/select";
import { Input }  from "@/components/ui/input";

const ORDER_STATUSES = [
  { value: "",                  label: "すべてのステータス" },
  { value: "NEW",               label: "新規" },
  { value: "VISIT_SCHEDULING",  label: "訪問調整中" },
  { value: "WORK_SCHEDULED",    label: "作業予定" },
  { value: "WORKING",           label: "作業中" },
  { value: "WORK_DONE",         label: "作業完了" },
  { value: "INVOICED",          label: "請求済" },
  { value: "PAID",              label: "入金済" },
  { value: "CLOSED",            label: "クローズ" },
] as const;

type Props = { status: string; q: string };

export function OrderFilters({ status, q }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState(q);

  // URL の q が変わったら入力欄に反映（ブラウザバック等で同期）
  useEffect(() => {
    setSearch(q);
  }, [q]);

  function push(updates: { status?: string; q?: string }) {
    const params = new URLSearchParams();
    const nextStatus = updates.status !== undefined ? updates.status : status;
    const nextQ      = updates.q      !== undefined ? updates.q      : q;
    if (nextStatus) params.set("status", nextStatus);
    if (nextQ)      params.set("q", nextQ);
    router.push(`/admin/orders${params.size > 0 ? `?${params}` : ""}`);
  }

  function clearSearch() {
    setSearch("");
    push({ q: "" });
  }

  function clearAll() {
    setSearch("");
    router.push("/admin/orders");
  }

  const hasFilters = status !== "" || q !== "";

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

  const btnPrimary: React.CSSProperties = {
    ...btnBase,
    backgroundColor: "#1a1a1a",
    color:           "#ffffff",
  };

  const btnSecondary: React.CSSProperties = {
    ...btnBase,
    backgroundColor: "#ffffff",
    color:           "#1a1a1a",
    border:          "1px solid #e0e0e0",
  };

  return (
    <div className="flex flex-wrap gap-3 items-center">
      {/* ステータスフィルタ */}
      <Select
        value={status}
        onChange={(e) => push({ status: e.target.value })}
        className="w-44"
        style={{ height: "40px" }}
      >
        {ORDER_STATUSES.map(({ value, label }) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </Select>

      {/* 検索フォーム */}
      <form
        className="flex gap-2 items-center"
        onSubmit={(e) => {
          e.preventDefault();
          push({ q: search });
        }}
      >
        <Input
          type="search"
          placeholder="顧客名で検索"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-48"
          style={{ height: "40px" }}
        />
        <button
          type="submit"
          style={btnPrimary}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.8"; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
        >
          検索
        </button>
        {q !== "" && (
          <button
            type="button"
            onClick={clearSearch}
            style={btnSecondary}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#f5f5f5"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#ffffff"; }}
          >
            クリア
          </button>
        )}
      </form>

      {hasFilters && (
        <button
          type="button"
          onClick={clearAll}
          style={btnSecondary}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#f5f5f5"; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#ffffff"; }}
        >
          すべてクリア
        </button>
      )}
    </div>
  );
}
