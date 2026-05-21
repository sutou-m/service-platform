"use server";

import { redirect }       from "next/navigation";
import { revalidatePath } from "next/cache";
import { supabaseAdmin }  from "@/lib/supabase";
import { getSession }     from "@/lib/auth-helpers";

export type ActionResult = { error?: string; success?: boolean };

export async function createPost(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { error: "認証が必要です" };

  const title       = (formData.get("title")        as string).trim();
  const slug        = (formData.get("slug")         as string).trim();
  const description = (formData.get("description")  as string).trim() || null;
  const content     = (formData.get("content")      as string).trim();
  const area        = (formData.get("area")         as string).trim() || null;
  const serviceType = (formData.get("service_type") as string).trim() || null;
  const completedAt = formData.get("completed_at")  as string;

  if (!title) return { error: "タイトルを入力してください" };
  if (!slug)  return { error: "スラッグを入力してください" };
  if (!/^[a-z0-9-]+$/.test(slug)) return { error: "スラッグは英小文字・数字・ハイフンのみ使用できます" };
  if (!content) return { error: "本文を入力してください" };

  const { data: dup } = await supabaseAdmin
    .from("cms_posts")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();
  if (dup) return { error: "このスラッグはすでに使用されています" };

  const id = crypto.randomUUID();

  // 画像アップロード
  const files = (formData.getAll("images") as File[]).filter((f) => f.size > 0);
  const imageUrls: string[] = [];

  for (const file of files.slice(0, 10)) {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) continue;
    const ext  = file.name.split(".").pop() ?? "jpg";
    const path = `posts/${id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: upErr } = await supabaseAdmin.storage
      .from("cms-images")
      .upload(path, file, { contentType: file.type });
    if (!upErr) {
      const { data } = supabaseAdmin.storage.from("cms-images").getPublicUrl(path);
      imageUrls.push(data.publicUrl);
    }
  }

  const { error } = await supabaseAdmin.from("cms_posts").insert({
    id,
    title,
    slug,
    description,
    content,
    area,
    service_type:  serviceType,
    completed_at:  completedAt ? new Date(completedAt).toISOString() : null,
    image_urls:    imageUrls,
    published:     false,
    updated_at:    new Date().toISOString(),
  });

  if (error) return { error: "保存に失敗しました: " + error.message };

  revalidatePath("/admin/cms");
  revalidatePath("/cases");
  redirect(`/admin/cms/${id}`);
}
