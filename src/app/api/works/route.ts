import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";
import { getMonthYear, canUploadWork } from "@/lib/utils";

const createWorkSchema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().min(1).max(500),
  category: z.enum(["planning", "marketing", "product", "course", "sales", "other"]),
  imageUrl: z.string().url(),
  tags: z.array(z.string()).max(5).optional(),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const sort = searchParams.get("sort") || "votes";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 12;

  const where: any = {
    status: { in: ["approved", "featured"] },
    ...(category && category !== "all" ? { category } : {}),
  };

  const orderBy =
    sort === "votes"
      ? { voteCount: "desc" as const }
      : sort === "views"
      ? { viewCount: "desc" as const }
      : { createdAt: "desc" as const };

  const [works, total] = await Promise.all([
    db.work.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: { user: { select: { id: true, name: true, image: true, title: true } } },
    }),
    db.work.count({ where }),
  ]);

  return NextResponse.json({ works, total, page, totalPages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "請先登入" }, { status: 401 });
  }
  if (!canUploadWork(session.user.role)) {
    return NextResponse.json({ error: "需要付費會員才能上傳作品" }, { status: 403 });
  }

  // Rate limit: max 3 per month
  const monthYear = getMonthYear();
  const count = await db.work.count({
    where: { userId: session.user.id, monthYear },
  });
  if (count >= 3) {
    return NextResponse.json({ error: "每月最多上傳 3 件作品" }, { status: 429 });
  }

  const body = await req.json();
  const parsed = createWorkSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const work = await db.work.create({
    data: {
      ...parsed.data,
      tags: parsed.data.tags ?? [],
      userId: session.user.id,
      monthYear,
      status: "pending",
    },
  });

  return NextResponse.json(work, { status: 201 });
}
