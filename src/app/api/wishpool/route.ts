export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const wishes = await db.wish.findMany({
    orderBy: { votes: { _count: "desc" } },
    include: { _count: { select: { votes: true } }, user: { select: { name: true } } },
  });
  return NextResponse.json(wishes);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "請先登入" }, { status: 401 });

  const { title, content } = await req.json();
  if (!title?.trim()) return NextResponse.json({ error: "標題為必填" }, { status: 400 });

  const wish = await db.wish.create({
    data: { title: title.trim(), content: content?.trim() || "", userId: session.user.id },
  });
  return NextResponse.json(wish, { status: 201 });
}
