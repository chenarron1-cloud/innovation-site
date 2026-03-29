export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getMonthYear } from "@/lib/utils";

export async function GET() {
  const monthYear = getMonthYear();
  const [totalWorks, totalVotes, totalCreators] = await Promise.all([
    db.work.count({ where: { status: { in: ["approved", "featured"] } } }),
    db.vote.count(),
    db.work.groupBy({ by: ["userId"], where: { status: { in: ["approved", "featured"] } } }).then(r => r.length),
  ]);

  // Calculate end of month
  const now = new Date();
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  endOfMonth.setHours(23, 59, 59);

  return NextResponse.json({ totalWorks, totalVotes, totalCreators, monthYear, endOfMonth });
}
