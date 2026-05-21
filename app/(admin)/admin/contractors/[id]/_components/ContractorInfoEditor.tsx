"use client";

import React, { useActionState, useState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { updateContractorInfo } from "../actions";
import { AREAS, SERVICE_TYPES } from "@/lib/data/service-types";
import { Input }    from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label }    from "@/components/ui/label";
import { Button }   from "@/components/ui/button";
import { Alert }    from "@/components/ui/alert";

type ActionResult = { error?: string; success?: boolean };

type ContractorInfo = {
  id:            string;
  company_name:  string;
  owner_name:    string;
  address:       string;
  phone:         string;
  email:         string;
  bio:           string | null;
  areas:         string[];
  service_types: string[];
};

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" loading={pending} disabled={pending}>
      保存
    </Button>
  );
}

function Row({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex gap-4 py-3 border-b border-border last:border-0">
      <dt className="w-28 shrink-0 text-xs font-medium text-muted">{label}</dt>
      <dd className="text-sm text-foreground whitespace-pre-wrap">{value}</dd>
    </div>
  );
}

function TagList({ items }: { items: string[] }) {
  if (items.length === 0) return <p className="text-sm text-muted">未設定</p>;
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-full px-2.5 py-0.5 text-xs"
          style={{ backgroundColor: "#f5f5f5", color: "#1a1a1a", border: "1px solid #e0e0e0" }}
        >
          {item}
        </span>
      ))}
    </div>
  );
}

const editBtnStyle: React.CSSProperties = {
  display:         "inline-flex",
  alignItems:      "center",
  height:          "32px",
  padding:         "0 12px",
  borderRadius:    "4px",
  fontSize:        "12px",
  fontWeight:      500,
  cursor:          "pointer",
  backgroundColor: "#f5f5f5",
  color:           "#1a1a1a",
  border:          "1px solid #e0e0e0",
};

const cancelBtnStyle: React.CSSProperties = {
  display:         "inline-flex",
  alignItems:      "center",
  height:          "36px",
  padding:         "0 16px",
  borderRadius:    "4px",
  fontSize:        "14px",
  fontWeight:      500,
  cursor:          "pointer",
  backgroundColor: "#ffffff",
  color:           "#1a1a1a",
  border:          "1px solid #e0e0e0",
};

export function ContractorInfoEditor({ contractor }: { contractor: ContractorInfo }) {
  const [editing, setEditing] = useState(false);
  const [state, formAction] = useActionState<ActionResult | null, FormData>(
    updateContractorInfo,
    null
  );

  const [vals, setVals] = useState({
    company_name: contractor.company_name,
    owner_name:   contractor.owner_name,
    address:      contractor.address,
    phone:        contractor.phone,
    email:        contractor.email,
    bio:          contractor.bio ?? "",
  });
  const [selAreas,    setSelAreas]    = useState<string[]>(contractor.areas);
  const [selServices, setSelServices] = useState<string[]>(contractor.service_types);

  // 保存成功後は閲覧モードへ
  useEffect(() => {
    if (state?.success) setEditing(false);
  }, [state]);

  // props 更新時に同期
  useEffect(() => {
    setVals({
      company_name: contractor.company_name,
      owner_name:   contractor.owner_name,
      address:      contractor.address,
      phone:        contractor.phone,
      email:        contractor.email,
      bio:          contractor.bio ?? "",
    });
    setSelAreas(contractor.areas);
    setSelServices(contractor.service_types);
  }, [contractor]);

  function handleCancel() {
    setVals({
      company_name: contractor.company_name,
      owner_name:   contractor.owner_name,
      address:      contractor.address,
      phone:        contractor.phone,
      email:        contractor.email,
      bio:          contractor.bio ?? "",
    });
    setSelAreas(contractor.areas);
    setSelServices(contractor.service_types);
    setEditing(false);
  }

  function toggleArea(area: string) {
    setSelAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  }

  function toggleService(svc: string) {
    setSelServices((prev) =>
      prev.includes(svc) ? prev.filter((s) => s !== svc) : [...prev, svc]
    );
  }

  const set = (field: keyof typeof vals) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setVals((v) => ({ ...v, [field]: e.target.value }));

  if (!editing) {
    return (
      <>
        {/* 基本情報 */}
        <div className="rounded-lg border border-border bg-surface p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground">基本情報</h2>
            <button
              type="button"
              style={editBtnStyle}
              onClick={() => setEditing(true)}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#ebebeb"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#f5f5f5"; }}
            >
              編集
            </button>
          </div>
          <dl>
            <Row label="会社名"   value={vals.company_name} />
            <Row label="代表者名" value={vals.owner_name} />
            <Row label="住所"     value={vals.address} />
            <Row label="電話番号" value={vals.phone} />
            <Row label="メール"   value={vals.email} />
            <Row label="自己紹介" value={vals.bio || null} />
          </dl>
        </div>

        {/* 対応可能エリア */}
        <div className="rounded-lg border border-border bg-surface p-6">
          <h2 className="text-sm font-semibold text-foreground mb-3">対応可能エリア</h2>
          <TagList items={selAreas} />
        </div>

        {/* 対応作業種別 */}
        <div className="rounded-lg border border-border bg-surface p-6">
          <h2 className="text-sm font-semibold text-foreground mb-3">対応作業種別</h2>
          <TagList items={selServices} />
        </div>
      </>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-surface p-6">
      <h2 className="text-sm font-semibold text-foreground mb-5">基本情報を編集</h2>

      {state?.error && <Alert variant="danger" className="mb-4">{state.error}</Alert>}

      <form action={formAction} className="space-y-5">
        <input type="hidden" name="contractorId" value={contractor.id} />
        {/* 選択済みエリア・作業種別を hidden input で送信 */}
        {selAreas.map((a)    => <input key={a} type="hidden" name="areas"         value={a} />)}
        {selServices.map((s) => <input key={s} type="hidden" name="service_types" value={s} />)}

        {/* テキストフィールド */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="ci-company">会社名 *</Label>
            <Input id="ci-company" name="company_name" value={vals.company_name} onChange={set("company_name")} className="mt-1" required />
          </div>
          <div>
            <Label htmlFor="ci-owner">代表者名 *</Label>
            <Input id="ci-owner" name="owner_name" value={vals.owner_name} onChange={set("owner_name")} className="mt-1" required />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="ci-address">住所 *</Label>
            <Input id="ci-address" name="address" value={vals.address} onChange={set("address")} className="mt-1" required />
          </div>
          <div>
            <Label htmlFor="ci-phone">電話番号 *</Label>
            <Input id="ci-phone" name="phone" type="tel" value={vals.phone} onChange={set("phone")} className="mt-1" required />
          </div>
          <div>
            <Label htmlFor="ci-email">メール *</Label>
            <Input id="ci-email" name="email" type="email" value={vals.email} onChange={set("email")} className="mt-1" required />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="ci-bio">自己紹介・実績</Label>
            <Textarea id="ci-bio" name="bio" rows={4} value={vals.bio} onChange={set("bio")} className="mt-1" placeholder="業務経験・実績などを入力してください" />
          </div>
        </div>

        {/* 対応可能エリア */}
        <div>
          <p className="block text-sm font-medium text-foreground mb-2">対応可能エリア</p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-1.5 max-h-52 overflow-y-auto rounded border border-border p-3">
            {AREAS.map((area) => (
              <label key={area} className="flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={selAreas.includes(area)}
                  onChange={() => toggleArea(area)}
                  className="rounded"
                />
                <span className="text-xs text-foreground">{area}</span>
              </label>
            ))}
          </div>
          <p className="mt-1 text-xs text-muted">{selAreas.length} 件選択中</p>
        </div>

        {/* 対応作業種別 */}
        <div>
          <p className="block text-sm font-medium text-foreground mb-2">対応作業種別</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {SERVICE_TYPES.map((svc) => (
              <label key={svc} className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={selServices.includes(svc)}
                  onChange={() => toggleService(svc)}
                  className="rounded"
                />
                <span className="text-sm text-foreground">{svc}</span>
              </label>
            ))}
          </div>
        </div>

        {/* アクション */}
        <div className="flex justify-end gap-2 pt-2 border-t border-border">
          <button
            type="button"
            onClick={handleCancel}
            style={cancelBtnStyle}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#f5f5f5"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#ffffff"; }}
          >
            キャンセル
          </button>
          <SaveButton />
        </div>
      </form>
    </div>
  );
}
