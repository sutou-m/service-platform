"use client";

import { useActionState, useState } from "react";
import { submitApply, type ActionResult } from "../actions";
import { AREAS, SERVICE_TYPES } from "@/lib/data/service-types";
import { Input }    from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label }    from "@/components/ui/label";
import { Alert }    from "@/components/ui/alert";
import { Spinner }  from "@/components/ui/spinner";

const initialState: ActionResult = {};

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return (
    <p className="mt-1 text-xs text-danger" role="alert">
      {messages[0]}
    </p>
  );
}

export function ApplyForm() {
  const [state, formAction, isPending] = useActionState(submitApply, initialState);

  const [values, setValues] = useState({
    companyName: "",
    ownerName:   "",
    address:     "",
    phone:       "",
    email:       "",
    bio:         "",
  });

  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [selectedServiceTypes, setSelectedServiceTypes] = useState<string[]>([]);

  const set = (field: keyof typeof values) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValues((v) => ({ ...v, [field]: e.target.value }));

  const toggleArea = (area: string) =>
    setSelectedAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );

  const toggleServiceType = (type: string) =>
    setSelectedServiceTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );

  return (
    <form action={formAction} className="space-y-6" noValidate>
      {state.errors?._form && (
        <Alert variant="danger">{state.errors._form[0]}</Alert>
      )}

      {/* 会社名 */}
      <div>
        <Label htmlFor="companyName" required>会社名（屋号）</Label>
        <div className="mt-1">
          <Input
            id="companyName"
            name="companyName"
            type="text"
            autoComplete="organization"
            placeholder="株式会社〇〇 / 〇〇工務店"
            value={values.companyName}
            onChange={set("companyName")}
            error={!!state.errors?.companyName}
            disabled={isPending}
          />
        </div>
        <FieldError messages={state.errors?.companyName} />
      </div>

      {/* 代表者名 */}
      <div>
        <Label htmlFor="ownerName" required>代表者名</Label>
        <div className="mt-1">
          <Input
            id="ownerName"
            name="ownerName"
            type="text"
            autoComplete="name"
            placeholder="山田 太郎"
            value={values.ownerName}
            onChange={set("ownerName")}
            error={!!state.errors?.ownerName}
            disabled={isPending}
          />
        </div>
        <FieldError messages={state.errors?.ownerName} />
      </div>

      {/* 住所 */}
      <div>
        <Label htmlFor="address" required>住所</Label>
        <div className="mt-1">
          <Input
            id="address"
            name="address"
            type="text"
            autoComplete="street-address"
            placeholder="東京都渋谷区〇〇 1-2-3"
            value={values.address}
            onChange={set("address")}
            error={!!state.errors?.address}
            disabled={isPending}
          />
        </div>
        <FieldError messages={state.errors?.address} />
      </div>

      {/* 電話番号 */}
      <div>
        <Label htmlFor="phone" required>電話番号</Label>
        <div className="mt-1">
          <Input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="090-1234-5678"
            value={values.phone}
            onChange={set("phone")}
            error={!!state.errors?.phone}
            disabled={isPending}
          />
        </div>
        <FieldError messages={state.errors?.phone} />
      </div>

      {/* メールアドレス */}
      <div>
        <Label htmlFor="email" required>メールアドレス</Label>
        <div className="mt-1">
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="info@example.com"
            value={values.email}
            onChange={set("email")}
            error={!!state.errors?.email}
            disabled={isPending}
          />
        </div>
        <FieldError messages={state.errors?.email} />
      </div>

      {/* 対応可能エリア */}
      <div>
        <p className="text-sm font-medium text-foreground mb-2">
          対応可能エリア
          <span className="ml-1 text-danger text-xs">*</span>
        </p>
        {/* hidden inputs to submit selected values */}
        {selectedAreas.map((area) => (
          <input key={area} type="hidden" name="areas" value={area} />
        ))}
        <div
          className={[
            "rounded border p-3 max-h-48 overflow-y-auto",
            state.errors?.areas ? "border-danger" : "border-border",
          ].join(" ")}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-4">
            {AREAS.map((area) => (
              <label key={area} className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={selectedAreas.includes(area)}
                  onChange={() => toggleArea(area)}
                  disabled={isPending}
                  className="accent-ink w-4 h-4 shrink-0"
                />
                <span className="text-sm text-foreground">{area}</span>
              </label>
            ))}
          </div>
        </div>
        <FieldError messages={state.errors?.areas} />
      </div>

      {/* 対応可能作業種別 */}
      <div>
        <p className="text-sm font-medium text-foreground mb-2">
          対応可能作業種別
          <span className="ml-1 text-danger text-xs">*</span>
        </p>
        {selectedServiceTypes.map((type) => (
          <input key={type} type="hidden" name="serviceTypes" value={type} />
        ))}
        <div
          className={[
            "rounded border p-3",
            state.errors?.serviceTypes ? "border-danger" : "border-border",
          ].join(" ")}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
            {SERVICE_TYPES.map((type) => (
              <label key={type} className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={selectedServiceTypes.includes(type)}
                  onChange={() => toggleServiceType(type)}
                  disabled={isPending}
                  className="accent-ink w-4 h-4 shrink-0"
                />
                <span className="text-sm text-foreground">{type}</span>
              </label>
            ))}
          </div>
        </div>
        <FieldError messages={state.errors?.serviceTypes} />
      </div>

      {/* 自己紹介・実績（任意） */}
      <div>
        <Label htmlFor="bio">自己紹介・実績</Label>
        <p className="mt-0.5 text-xs text-muted">任意</p>
        <div className="mt-1">
          <Textarea
            id="bio"
            name="bio"
            rows={4}
            placeholder="会社・事業者の紹介、これまでの実績などをご記入ください"
            value={values.bio}
            onChange={set("bio")}
            disabled={isPending}
          />
        </div>
      </div>

      {/* 送信ボタン */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isPending}
          className={[
            "inline-flex w-full items-center justify-center gap-2",
            "px-6 py-4 text-sm font-medium tracking-[0.1em]",
            "transition-opacity disabled:cursor-not-allowed disabled:opacity-50",
            isPending ? "opacity-70" : "hover:opacity-80",
          ].join(" ")}
          style={{ backgroundColor: "#1a1a1a", color: "#ffffff" }}
        >
          {isPending && <Spinner size="sm" />}
          {isPending ? "送信中..." : "申請する"}
        </button>
      </div>
    </form>
  );
}
