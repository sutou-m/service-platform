"use client";

import { useActionState, useState } from "react";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { updateServiceTypes, type ActionResult } from "../actions";

export function ServiceTypesPanel({ initialTypes }: { initialTypes: string[] }) {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(
    updateServiceTypes,
    null
  );
  const [types,    setTypes]    = useState<string[]>(initialTypes);
  const [newType,  setNewType]  = useState("");

  function addType() {
    const t = newType.trim();
    if (!t || types.includes(t)) return;
    setTypes((prev) => [...prev, t]);
    setNewType("");
  }

  function removeType(index: number) {
    setTypes((prev) => prev.filter((_, i) => i !== index));
  }

  function moveUp(index: number) {
    if (index === 0) return;
    setTypes((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  }

  function moveDown(index: number) {
    if (index === types.length - 1) return;
    setTypes((prev) => {
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
  }

  return (
    <div>
      <h2 className="text-sm font-semibold text-ink mb-3">サービス種別マスタ</h2>
      <div className="border border-border rounded p-4 max-w-lg space-y-4">
        {state?.error   && <Alert variant="danger">{state.error}</Alert>}
        {state?.success && <Alert variant="success">保存しました</Alert>}

        {/* 種別リスト */}
        <div className="space-y-1.5">
          {types.length === 0 ? (
            <p className="text-xs text-muted py-2">種別が登録されていません</p>
          ) : (
            types.map((t, i) => (
              <div key={t} className="flex items-center gap-2 border border-border rounded px-3 py-2 bg-paper">
                <span className="flex-1 text-sm text-foreground">{t}</span>
                <button
                  type="button"
                  onClick={() => moveUp(i)}
                  disabled={i === 0}
                  title="上へ"
                  style={{
                    width:           "28px",
                    height:          "28px",
                    borderRadius:    "4px",
                    border:          "1px solid #e0e0e0",
                    backgroundColor: i === 0 ? "#f5f5f5" : "#ffffff",
                    color:           i === 0 ? "#aaa" : "#1a1a1a",
                    cursor:          i === 0 ? "not-allowed" : "pointer",
                    display:         "flex",
                    alignItems:      "center",
                    justifyContent:  "center",
                  } as React.CSSProperties}
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => moveDown(i)}
                  disabled={i === types.length - 1}
                  title="下へ"
                  style={{
                    width:           "28px",
                    height:          "28px",
                    borderRadius:    "4px",
                    border:          "1px solid #e0e0e0",
                    backgroundColor: i === types.length - 1 ? "#f5f5f5" : "#ffffff",
                    color:           i === types.length - 1 ? "#aaa" : "#1a1a1a",
                    cursor:          i === types.length - 1 ? "not-allowed" : "pointer",
                    display:         "flex",
                    alignItems:      "center",
                    justifyContent:  "center",
                  } as React.CSSProperties}
                >
                  ▼
                </button>
                <button
                  type="button"
                  onClick={() => removeType(i)}
                  title="削除"
                  style={{
                    width:           "28px",
                    height:          "28px",
                    borderRadius:    "4px",
                    border:          "1px solid #FCA5A5",
                    backgroundColor: "#FEE2E2",
                    color:           "#991B1B",
                    cursor:          "pointer",
                    display:         "flex",
                    alignItems:      "center",
                    justifyContent:  "center",
                    fontSize:        "14px",
                  } as React.CSSProperties}
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>

        {/* 新規追加 */}
        <div className="flex gap-2">
          <Input
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            placeholder="例：エアコン取付"
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addType(); } }}
          />
          <button
            type="button"
            onClick={addType}
            style={{
              height:          "40px",
              padding:         "0 16px",
              borderRadius:    "4px",
              fontSize:        "14px",
              cursor:          "pointer",
              backgroundColor: "#ffffff",
              color:           "#1a1a1a",
              border:          "1px solid #e0e0e0",
              whiteSpace:      "nowrap",
            } as React.CSSProperties}
          >
            追加
          </button>
        </div>

        {/* 保存（hidden inputs で types 配列を送信） */}
        <form action={formAction}>
          {types.map((t) => (
            <input key={t} type="hidden" name="types" value={t} />
          ))}
          <div className="flex justify-end pt-2 border-t border-border">
            <button
              type="submit"
              disabled={pending}
              style={{
                height:          "40px",
                padding:         "0 20px",
                borderRadius:    "4px",
                fontSize:        "14px",
                fontWeight:      600,
                cursor:          pending ? "not-allowed" : "pointer",
                backgroundColor: "#1a1a1a",
                color:           "#ffffff",
                border:          "none",
                opacity:         pending ? 0.6 : 1,
              } as React.CSSProperties}
            >
              {pending ? "保存中..." : "保存する"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
