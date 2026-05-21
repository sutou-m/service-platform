"use server";

import { redirect }       from "next/navigation";
import { revalidatePath } from "next/cache";
import { supabaseAdmin }  from "@/lib/supabase";
import { getSession }     from "@/lib/auth-helpers";

export type ActionResult = { error?: string; success?: boolean };

export async function updatePost(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { error: "認証が必要です" };

  const id          = formData.get("postId")        as string;
  const title       = (formData.get("title")        as string).trim();
  const slug        = (formData.get("slug")         as string).trim();
  const description = (formData.get("description")  as string).trim() || null;
  const content     = (formData.get("content")      as string).trim();
  const area        = (formData.get("area")         as string).trim() || null;
  const serviceType = (formData.get("service_type") as string).trim() || null;
  const completedAt = formData.get("completed_at")  as string;
  const keepImages  = formData.getAll("keepImages") as string[];

  if (!title) return { error: "タイトルを入力してください" };
  if (!slug)  return { error: "スラッグを入力してください" };
  if (!/^[a-z0-9-]+$/.test(slug)) return { error: "スラッグは英小文字・数字・ハイフンのみ使用できます" };
  if (!content) return { error: "本文を入力してください" };

  const { data: dup } = await supabaseAdmin
    .from("cms_posts")
    .select("id")
    .eq("slug", slug)
    .neq("id", id)
    .maybeSingle();
  if (dup) return { error: "このスラッグはすでに使用されています" };

  // 新規画像アップロード
  const files = (formData.getAll("images") as File[]).filter((f) => f.size > 0);
  const newUrls: string[] = [];
  const limit = Math.max(0, 10 - keepImages.length);

  for (const file of files.slice(0, limit)) {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) continue;
    const ext  = file.name.split(".").pop() ?? "jpg";
    const path = `posts/${id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: upErr } = await supabaseAdmin.storage
      .from("cms-images")
      .upload(path, file, { contentType: file.type });
    if (!upErr) {
      const { data } = supabaseAdmin.storage.from("cms-images").getPublicUrl(path);
      newUrls.push(data.publicUrl);
    }
  }

  const { error } = await supabaseAdmin
    .from("cms_posts")
    .update({
      title,
      slug,
      description,
      content,
      area,
      service_type:  serviceType,
      completed_at:  completedAt ? new Date(completedAt).toISOString() : null,
      image_urls:    [...keepImages, ...newUrls],
      updated_at:    new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return { error: "保存に失敗しました" };

  revalidatePath(`/admin/cms/${id}`);
  revalidatePath("/admin/cms");
  revalidatePath("/cases");
  return { success: true };
}

export async function togglePublish(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { error: "認証が必要です" };

  const id        = formData.get("postId")    as string;
  const published = formData.get("published") === "true";

  const { error } = await supabaseAdmin
    .from("cms_posts")
    .update({ published, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { error: "切替に失敗しました" };

  revalidatePath(`/admin/cms/${id}`);
  revalidatePath("/admin/cms");
  revalidatePath("/cases");
  return { success: true };
}

export async function deletePost(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) return { error: "認証が必要です" };

  const id = formData.get("postId") as string;

  // Storage の画像削除
  const { data: post } = await supabaseAdmin
    .from("cms_posts")
    .select("image_urls")
    .eq("id", id)
    .single();

  if (post?.image_urls?.length) {
    const paths = (post.image_urls as string[])
      .map((url) => {
        const m = url.match(/posts\/[^?]+/);
        return m ? m[0] : null;
      })
      .filter((p): p is string => p !== null);

    if (paths.length > 0) {
      await supabaseAdmin.storage.from("cms-images").remove(paths);
    }
  }

  const { error } = await supabaseAdmin.from("cms_posts").delete().eq("id", id);
  if (error) return { error: "削除に失敗しました" };

  revalidatePath("/admin/cms");
  revalidatePath("/cases");
  redirect("/admin/cms");
}
