// app/api/reports/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { claimItem, applyAction } from "@/lib/queue-store";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // ← Next.js 16 को लागि Promise बनाइएको
) {
  const { id } = await context.params; // ← await गरी id झिकिएको
  const body = await req.json();
  
  const adminId = req.headers.get("X-Admin-Id") ?? "anonymous";
  const adminRole = req.headers.get("X-Admin-Role") ?? "USER";
  
  if (adminRole !== "ADMIN" && adminRole !== "MODERATOR") {
    return NextResponse.json({ error: "Forbidden: Insufficient role" }, { status: 403 });
  }
  
  let result;
  if (body.type === "claim") {
    result = claimItem(id, adminId);
  } else if (body.type === "action") {
    result = applyAction(id, adminId, body.action, body.note, adminRole);
  } else {
    return NextResponse.json({ error: "Invalid action type" }, { status: 400 });
  }

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.code });
  }

  return NextResponse.json(result.item);
}