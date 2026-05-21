"use client";

import { useActionState, useEffect, useState } from "react";
import { submitContact, type ActionResult } from "../actions";
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

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContact, initialState);

  // React 19 はフォーム送信後に DOM を自動リセットするため、
  // controlled inputs で入力値を state に保持しておく
  const [values, setValues] = useState({
    name:        "",
    phone:       "",
    email:       "",
    address:     "",
    workContent: "",
    preferredAt: "",
    notes:       "",
  });

  // datetime-local の min は SSR/CSR 差異を避けるため useEffect で設定
  const [minDatetime, setMinDatetime] = useState("");
  useEffect(() => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    setMinDatetime(
      `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}` +
      `T${pad(now.getHours())}:${pad(now.getMinutes())}`
    );
  }, []);

  const set = (field: keyof typeof values) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValues((v) => ({ ...v, [field]: e.target.value }));

  return (
    <form action={formAction} className="space-y-6" noValidate>
      {/* フォーム全体エラー */}
      {state.errors?._form && (
        <Alert variant="danger">{state.errors._form[0]}</Alert>
      )}

      {/* 氏名 */}
      <div>
        <Label htmlFor="name" required>氏名</Label>
        <div className="mt-1">
          <Input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="山田 太郎"
            value={values.name}
            onChange={set("name")}
            error={!!state.errors?.name}
            disabled={isPending}
          />
        </div>
        <FieldError messages={state.errors?.name} />
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
            placeholder="taro@example.com"
            value={values.email}
            onChange={set("email")}
            error={!!state.errors?.email}
            disabled={isPending}
          />
        </div>
        <FieldError messages={state.errors?.email} />
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

      {/* 希望作業内容 */}
      <div>
        <Label htmlFor="workContent" required>希望作業内容</Label>
        <div className="mt-1">
          <Textarea
            id="workContent"
            name="workContent"
            rows={4}
            placeholder="例：洗面所の蛇口交換、キッチンのリフォームなど"
            value={values.workContent}
            onChange={set("workContent")}
            error={!!state.errors?.workContent}
            disabled={isPending}
          />
        </div>
        <FieldError messages={state.errors?.workContent} />
      </div>

      {/* 希望日時（任意） */}
      <div>
        <Label htmlFor="preferredAt">希望日時</Label>
        <p className="mt-0.5 text-xs text-muted">任意</p>
        <div className="mt-1">
          <Input
            id="preferredAt"
            name="preferredAt"
            type="datetime-local"
            min={minDatetime}
            value={values.preferredAt}
            onChange={set("preferredAt")}
            error={!!state.errors?.preferredAt}
            disabled={isPending}
          />
        </div>
        <FieldError messages={state.errors?.preferredAt} />
      </div>

      {/* 備考（任意） */}
      <div>
        <Label htmlFor="notes">備考</Label>
        <p className="mt-0.5 text-xs text-muted">任意</p>
        <div className="mt-1">
          <Textarea
            id="notes"
            name="notes"
            rows={3}
            placeholder="その他ご要望があればご記入ください"
            value={values.notes}
            onChange={set("notes")}
            disabled={isPending}
          />
        </div>
      </div>

      {/* 写真アップロード（任意・uncontrolled のまま） */}
      <div>
        <Label htmlFor="photos">写真</Label>
        <p className="mt-0.5 text-xs text-muted">
          任意・JPEG/PNG・最大5枚・1枚5MB以下
        </p>
        <div className="mt-1">
          <input
            id="photos"
            name="photos"
            type="file"
            accept="image/jpeg,image/png"
            multiple
            disabled={isPending}
            className={[
              "w-full rounded border px-3 py-2 text-sm text-foreground",
              "file:mr-3 file:rounded file:border-0 file:bg-accent file:px-3 file:py-1",
              "file:text-xs file:font-medium file:text-ink file:cursor-pointer",
              "cursor-pointer transition-colors",
              "disabled:cursor-not-allowed disabled:opacity-50",
              state.errors?.photos ? "border-danger" : "border-border",
            ].join(" ")}
          />
        </div>
        <FieldError messages={state.errors?.photos} />
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
          {isPending ? "送信中..." : "送信する"}
        </button>
      </div>
    </form>
  );
}
