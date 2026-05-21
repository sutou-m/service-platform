"use client";

import { useActionState } from "react";
import { Input }  from "@/components/ui/input";
import { Alert }  from "@/components/ui/alert";
import { createAdmin, deleteAdmin, type ActionResult } from "../actions";

type User = {
  id:    string;
  name:  string;
  email: string;
  role:  string;
};

export function AdminAccountsPanel({
  users,
  currentUserId,
}: {
  users:         User[];
  currentUserId: string;
}) {
  return (
    <div className="space-y-8">
      <UserTable users={users} currentUserId={currentUserId} />
      <CreateAdminForm />
    </div>
  );
}

function UserTable({ users, currentUserId }: { users: User[]; currentUserId: string }) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-ink mb-3">管理者アカウント一覧</h2>
      <div className="border border-border rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-paper">
              <th className="text-left px-4 py-2.5 text-xs text-muted font-medium">名前</th>
              <th className="text-left px-4 py-2.5 text-xs text-muted font-medium">メールアドレス</th>
              <th className="text-left px-4 py-2.5 text-xs text-muted font-medium">ロール</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <UserRow key={u.id} user={u} isSelf={u.id === currentUserId} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function UserRow({ user, isSelf }: { user: User; isSelf: boolean }) {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(deleteAdmin, null);

  return (
    <tr className="border-b border-border last:border-0">
      <td className="px-4 py-3 text-foreground">{user.name}</td>
      <td className="px-4 py-3 text-foreground">{user.email}</td>
      <td className="px-4 py-3">
        <span className="text-xs border border-border px-2 py-0.5 rounded-full text-muted">
          {user.role}
        </span>
      </td>
      <td className="px-4 py-3 text-right">
        {!isSelf && (
          <form action={formAction}>
            <input type="hidden" name="userId" value={user.id} />
            {state?.error && (
              <span className="text-xs text-danger mr-2">{state.error}</span>
            )}
            <button
              type="submit"
              disabled={pending}
              onClick={(e) => {
                if (!window.confirm(`「${user.name}」のアカウントを削除しますか？この操作は取り消せません。`)) {
                  e.preventDefault();
                }
              }}
              style={{
                height:          "30px",
                padding:         "0 12px",
                borderRadius:    "4px",
                fontSize:        "12px",
                cursor:          pending ? "not-allowed" : "pointer",
                backgroundColor: "#FEE2E2",
                color:           "#991B1B",
                border:          "1px solid #FCA5A5",
                opacity:         pending ? 0.6 : 1,
              } as React.CSSProperties}
            >
              削除
            </button>
          </form>
        )}
        {isSelf && (
          <span className="text-xs text-muted">(自分)</span>
        )}
      </td>
    </tr>
  );
}

function CreateAdminForm() {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(createAdmin, null);

  return (
    <div>
      <h2 className="text-sm font-semibold text-ink mb-3">管理者アカウントを追加</h2>
      <div className="border border-border rounded p-4 space-y-4">
        {state?.error   && <Alert variant="danger">{state.error}</Alert>}
        {state?.success && <Alert variant="success">アカウントを作成しました</Alert>}

        <form action={formAction} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">
                名前 <span className="text-danger">*</span>
              </label>
              <Input name="name" placeholder="例：山田 太郎" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">
                メールアドレス <span className="text-danger">*</span>
              </label>
              <Input name="email" type="email" placeholder="admin@example.com" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">
                パスワード <span className="text-danger">*</span>
              </label>
              <Input name="password" type="password" placeholder="8文字以上" required />
            </div>
          </div>
          <div className="flex justify-end">
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
              {pending ? "作成中..." : "アカウントを作成"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
