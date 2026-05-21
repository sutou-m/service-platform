import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { supabaseAdmin } from "@/lib/supabase";
import { CaseDetail } from "../_components/CaseDetail";

export const revalidate = 60;

type Props = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  const { data } = await supabaseAdmin
    .from("cms_posts")
    .select("id")
    .eq("published", true);
  return (data ?? []).map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { data } = await supabaseAdmin
    .from("cms_posts")
    .select("title, description, image_urls")
    .eq("id", id)
    .eq("published", true)
    .single();

  if (!data) return {};

  return {
    title: `${data.title} | ServiceHub`,
    description: data.description ?? undefined,
    openGraph: data.image_urls?.[0]
      ? { images: [{ url: data.image_urls[0] }] }
      : undefined,
  };
}

export default async function CaseDetailPage({ params }: Props) {
  const { id } = await params;

  const { data: post } = await supabaseAdmin
    .from("cms_posts")
    .select("*")
    .eq("id", id)
    .eq("published", true)
    .single();

  if (!post) notFound();

  return (
    <div className="bg-paper min-h-screen">
      <CaseDetail
        title={post.title}
        description={post.description}
        content={post.content}
        imageUrls={post.image_urls ?? []}
        area={post.area}
        serviceType={post.service_type}
        completedAt={post.completed_at}
      />
    </div>
  );
}
