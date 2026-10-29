import { COMMUNITY_SLUGS } from "@/lib/communities";
import { CommunityView } from "./CommunityView";

export function generateStaticParams() {
  return COMMUNITY_SLUGS.map((slug) => ({ slug }));
}

export default async function CommunityFeedPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <CommunityView key={slug} slug={slug} />;
}