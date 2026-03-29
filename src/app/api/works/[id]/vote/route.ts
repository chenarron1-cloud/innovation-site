export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "請先登入才能投票" }, { status: 401 });
  }

  const work = await db.work.findUnique({ where: { id: params.id } });
  if (!work || (work.status !== "approved" && work.status !== "featured")) {
    return NextResponse.json({ error: "作品不存在" }, { status: 404 });
  }

  const existing = await db.vote.findUnique({
    where: { workId_userId: { workId: params.id, userId: session.user.id } },
  });

  if (existing) {
    // Toggle off - remove vote
    await db.$transaction([
      db.vote.delete({ where: { id: existing.id } }),
      db.work.update({ where: { id: params.id }, data: { voteCount: { decrement: 1 } } }),
    ]);
    return NextResponse.json({ voted: false, voteCount: work.voteCount - 1 });
  } else {
    // Add vote
    await db.$transaction([
      db.vote.create({ data: { workId: params.id, userId: session.user.id } }),
      db.work.update({ where: { id: params.id }, data: { voteCount: { increment: 1 } } }),
    ]);
    return NextResponse.json({ voted: true, voteCount: work.voteCount + 1 });
  }
}
