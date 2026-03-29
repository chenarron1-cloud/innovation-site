export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "請先登入" }, { status: 401 });

  const existing = await db.wishVote.findUnique({
    where: { wishId_userId: { wishId: params.id, userId: session.user.id } },
  });

  if (existing) {
    await db.wishVote.delete({ where: { id: existing.id } });
    return NextResponse.json({ voted: false });
  }
  await db.wishVote.create({ data: { wishId: params.id, userId: session.user.id } });
  return NextResponse.json({ voted: true });
}
