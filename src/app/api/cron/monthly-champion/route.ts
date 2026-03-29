import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Runs every 1st of the month at 00:05
export async function GET(req: NextRequest) {
  // Verify cron secret in production
  const authHeader = req.headers.get("authorization");
  if (process.env.NODE_ENV === "production" && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const monthYear = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, "0")}`;

  // Find top work of last month
  const champion = await db.work.findFirst({
    where: { status: { in: ["approved", "featured"] }, monthYear },
    orderBy: { voteCount: "desc" },
    include: { user: { select: { id: true, email: true, name: true } } },
  });

  if (!champion) {
    return NextResponse.json({ success: true, message: "No works found for last month" });
  }

  // Create badge
  await db.badge.create({
    data: {
      userId: champion.userId,
      badgeType: "monthly_champion",
      workId: champion.id,
      monthYear,
    },
  });

  // TODO: Send winner notification email via Resend
  // await sendChampionEmail(champion.user.email, champion.title, monthYear)

  return NextResponse.json({ success: true, champion: { id: champion.id, title: champion.title } });
}
