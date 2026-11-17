import { NextRequest, NextResponse } from "next/server";
import { updateCommunityStatus, deleteCommunity } from "@/lib/communities-store";
import { CommunityStatus } from "@/app/admin/communities/types/commmunities.type";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await req.json();

  const adminRole = req.headers.get("X-Admin-Role") ?? "USER";
  if (adminRole !== "ADMIN" && adminRole !== "MODERATOR") {
    return NextResponse.json({ error: "Forbidden: Insufficient role" }, { status: 403 });
  }

  if (body.type === "status") {
    const result = updateCommunityStatus(id, body.status as CommunityStatus);
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: result.code });
    }
    return NextResponse.json(result.community);
  }

  return NextResponse.json({ error: "Invalid action type" }, { status: 400 });
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const adminRole = req.headers.get("X-Admin-Role") ?? "USER";
  if (adminRole !== "ADMIN" && adminRole !== "MODERATOR") {
    return NextResponse.json({ error: "Forbidden: Insufficient role" }, { status: 403 });
  }

  const result = deleteCommunity(id);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.code });
  }

  return NextResponse.json({ success: true });
}