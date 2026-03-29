export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getMonthYear } from "@/lib/utils";

export async function GET() {
  const monthYear = getMonthYear();
  const top = await db.work.findMany({
    where: { status: { in: ["approved", "featured"] }, monthYear },
    orderBy: { voteCount: "desc" },
    take: 10,
    include: { user: { select: { id: true, name: true, image: true, title: true } } },
  });
  return NextResponse.json(top);
}
