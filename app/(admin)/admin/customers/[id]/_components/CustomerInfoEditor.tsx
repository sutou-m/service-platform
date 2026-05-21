"use client";

import React, { useActionState, useState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { updateCustomerInfo } from "../actions";
import { Input }  from "@/components/ui/input";
import { Label }  from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert }  from "@/components/ui/alert";

type ActionResult = { error?: string; success?: boolean };

type CustomerInfo = {
  id:      string;
  name:    string;
  phone:   string;
  email:   string;
  address: string | null;
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

export function CustomerInfoEditor({ customer }: { customer: CustomerInfo }) {
  const [editing, setEditing] = useState(false);
  const [state, formAction] = useActionState<ActionResult | null, FormData>(
    updateCustomerInfo,
    null
  );

  const [name,    setName]    = useState(customer.name);
  const [phone,   setPhone]   = useState(customer.phone);
  const [email,   setEmail]   = useState(customer.email);
  const [address, setAddress] = useState(customer.address ?? "");

  // 保存成功後に閲覧モードへ戻す
  useEffect(() => {
    if (state?.success) setEditing(false);
  }, [state]);

  // props が更新されたら同期（revalidatePath 後）
  useEffect(() => {
    setName(customer.name);
    setPhone(customer.phone);
    setEmail(customer.email);
    setAddress(customer.address ?? "");
  }, [customer.name, customer.phone, customer.email, customer.address]);

  function handleCancel() {
    setName(customer.name);
    setPhone(customer.phone);
    setEmail(customer.email);
    setAddress(customer.address ?? "");
    setEditing(false);
  }

  return (
    <div className="rounded-lg border border-border bg-surface p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-foreground">基本情報</h2>
        {!editing && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            style={{
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
            } as React.CSSProperties}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#ebebeb"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#f5f5f5"; }}
          >
            編集
          </button>
        )}
      </div>

      {!editing ? (
        <dl>
          <Row label="氏名"     value={name} />
          <Row label="電話番号" value={phone} />
          <Row label="メール"   value={email} />
          <Row label="住所"     value={address || null} />
        </dl>
      ) : (
        <>
          {state?.error && <Alert variant="danger" className="mb-4">{state.error}</Alert>}

          <form action={formAction} className="space-y-4">
            <input type="hidden" name="customerId" value={customer.id} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ci-name">氏名 *</Label>
                <Input
                  id="ci-name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="ci-phone">電話番号 *</Label>
                <Input
                  id="ci-phone"
                  name="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="ci-email">メール *</Label>
                <Input
                  id="ci-email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="ci-address">住所</Label>
                <Input
                  id="ci-address"
                  name="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={handleCancel}
                style={{
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
                } as React.CSSProperties}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#f5f5f5"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#ffffff"; }}
              >
                キャンセル
              </button>
              <SaveButton />
            </div>
          </form>
        </>
      )}
    </div>
  );
}
