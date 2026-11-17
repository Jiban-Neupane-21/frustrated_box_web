import { NextRequest, NextResponse } from "next/server";
import { updateUserRole, updateUserStatus, deleteUser } from "@/lib/user-store";
import { UserRole, UserStatus } from "@/types/user-management.type";

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

  let result;
  if (body.type === "role") {
    // केवल ADMIN ले मात्र रोल परिवर्तन गर्न पाउने सुरक्षा नियम राख्न सकिन्छ
    if (adminRole !== "ADMIN") {
      return NextResponse.json({ error: "Only admins can change user roles" }, { status: 403 });
    }
    result = updateUserRole(id, body.role as UserRole);
  } else if (body.type === "status") {
    result = updateUserStatus(id, body.status as UserStatus);
  } else {
    return NextResponse.json({ error: "Invalid action type" }, { status: 400 });
  }

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.code });
  }

  return NextResponse.json(result.user);
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const adminRole = req.headers.get("X-Admin-Role") ?? "USER";
  if (adminRole !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden: Only admins can delete users" }, { status: 403 });
  }

  const result = deleteUser(id);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.code });
  }

  return NextResponse.json({ success: true });
}