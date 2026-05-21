"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { togglePublish } from "../actions";

type ActionResult = { error?: string; success?: boolean };

export function PublishToggle({
  postId,
  published,
}: {
  postId:    string;
  published: boolean;
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(
    togglePublish,
    null
  );

  useEffect(() => {
    if (state?.success) router.refresh();
  }, [state]);

  return (
    <div>
      <p className="text-xs font-medium text-muted mb-3">公開設定</p>

      <div
        className="flex items-center justify-between p-3 rounded border border-border"
        style={{ backgroundColor: published ? "#f0fdf4" : "#f9f9f9" }}
      >
        <div>
          <p className="text-sm font-medium" style={{ color: published ? "#15803d" : "#555" }}>
            {published ? "公開中" : "非公開"}
          </p>
          <p className="text-xs text-muted mt-0.5">
            {published ? "公開サイトに表示されています" : "下書き状態です"}
          </p>
        </div>

        <form action={formAction}>
          <input type="hidden" name="postId"    value={postId} />
          <input type="hidden" name="published" value={String(!published)} />
          <button
            type="submit"
            disabled={pending}
            style={{
              height:          "36px",
              padding:         "0 14px",
              borderRadius:    "4px",
              fontSize:        "13px",
              fontWeight:      500,
              cursor:          pending ? "not-allowed" : "pointer",
              backgroundColor: published ? "#ffffff" : "#1a1a1a",
              color:           published ? "#1a1a1a" : "#ffffff",
              border:          published ? "1px solid #e0e0e0" : "none",
              opacity:         pending ? 0.6 : 1,
            } as React.CSSProperties}
          >
            {pending ? "..." : published ? "非公開にする" : "公開する"}
          </button>
        </form>
      </div>

      {state?.error && (
        <p className="mt-2 text-xs text-danger">{state.error}</p>
      )}
    </div>
  );
}
