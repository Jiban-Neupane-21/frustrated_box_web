import { NextRequest, NextResponse } from "next/server";
import { getUsers } from "@/lib/user-store";
import { UserRole, UserStatus } from "@/types/user-management.type";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const role = (searchParams.get("role") as UserRole | "all") || "all";
  const status = (searchParams.get("status") as UserStatus | "all") || "all";
  const q = searchParams.get("q") || "";

  const users = getUsers({ role, status, q });

  return NextResponse.json({ users });
}