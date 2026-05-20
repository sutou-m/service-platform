import { supabaseAdmin } from "@/lib/supabase";
import { HeroSection } from "./_components/HeroSection";
import { CasesGrid } from "./_components/CasesGrid";
import { ServicesSection } from "./_components/ServicesSection";
import { FaqSection } from "./_components/FaqSection";
import { ContractorCta } from "./_components/ContractorCta";

export const dynamic = "force-static";
export const revalidate = 3600; // revalidate every hour

async function getCmsPosts() {
  const { data } = await supabaseAdmin
    .from("cms_posts")
    .select("id, title, slug, description, image_urls, area, service_type")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(6);
  return data ?? [];
}

export default async function TopPage() {
  const posts = await getCmsPosts();

  return (
    <>
      <HeroSection />
      <CasesGrid posts={posts} />
      <ServicesSection />
      <FaqSection />
      <ContractorCta />
    </>
  );
}
