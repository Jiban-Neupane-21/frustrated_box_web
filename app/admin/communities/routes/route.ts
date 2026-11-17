import { NextRequest, NextResponse } from "next/server";
import { getCommunities } from "@/lib/communities-store";
import { CommunityStatus } from "@/app/admin/communities/types/commmunities.type";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = (searchParams.get("status") as CommunityStatus | "all") || "all";
  const category = searchParams.get("category") || "all";
  const q = searchParams.get("q") || "";

  const communities = getCommunities({ status, category, q });

  return NextResponse.json({ communities });
}