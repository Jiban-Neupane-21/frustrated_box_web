import { NextRequest, NextResponse } from "next/server";
import { listItems, type Filters } from "@/lib/queue-store";

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams;
  
  const filters: Filters = {
    status: (p.get("status") ?? "all") as Filters["status"],
    reason: (p.get("reason") ?? "all") as Filters["reason"],
    q: p.get("q") ?? "",
    sort: (p.get("sort") ?? "priority") as Filters["sort"],
  };

  const rows = listItems(filters);
  return NextResponse.json({ items: rows });
}