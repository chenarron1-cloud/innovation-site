import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Image from "next/image";
import Link from "next/link";
import { WorkVoteButton } from "@/components/features/works/vote-button";
import { formatDate } from "@/lib/utils";
import { Eye, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

interface Props { params: { id: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const work = await db.work.findUnique({ where: { id: params.id } });
  if (!work) return {};
  return { title: work.title, description: work.description.slice(0, 155) };
}

export default async function WorkDetailPage({ params }: Props) {
  const [work, session] = await Promise.all([
    db.work.findUnique({
      where: { id: params.id },
      include: { user: { select: { id: true, name: true, image: true, title: true } } },
    }),
    getServerSession(authOptions),
  ]);

  if (!work || (work.status !== "approved" && work.status !== "featured")) notFound();

  // Increment view count (fire-and-forget)
  db.work.update({ where: { id: params.id }, data: { viewCount: { increment: 1 } } }).catch(() => {});

  let userVoted = false;
  if (session?.user?.id) {
    const vote = await db.vote.findUnique({
      where: { workId_userId: { workId: params.id, userId: session.user.id } },
    });
    userVoted = !!vote;
  }

  const categoryLabels: Record<string, string> = {
    planning: "企劃", marketing: "行銷", product: "產品", course: "課程", sales: "銷售", other: "其他",
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/works" className="flex items-center gap-2 text-sm text-t2 hover:text-ind mb-6">
        <ArrowLeft className="h-4 w-4" />
        返回作品列表
      </Link>

      {/* Cover */}
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-bg2 mb-8">
        <Image src={work.imageUrl} alt={work.title} fill className="object-cover" sizes="100vw" />
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs bg-ind-bg text-ind rounded-full px-2.5 py-1 font-medium">
              {categoryLabels[work.category]}
            </span>
            {work.isFeatured && (
              <span className="text-xs bg-amber/10 text-amber rounded-full px-2.5 py-1 font-medium">精選</span>
            )}
          </div>
          <h1 className="text-2xl font-[500] text-t1 mb-2" style={{ wordBreak: "keep-all" }}>
            {work.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-t3">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-full bg-ind-bg flex items-center justify-center text-xs font-medium text-ind">
                {work.user.name?.charAt(0) || "U"}
              </div>
              <span>{work.user.name}</span>
              {work.user.title && <span className="hidden sm:inline text-t3">· {work.user.title}</span>}
            </div>
            <span>{formatDate(work.createdAt)}</span>
            <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{work.viewCount}</span>
          </div>
        </div>

        <WorkVoteButton workId={work.id} initialVoted={userVoted} initialCount={work.voteCount} />
      </div>

      {/* Description */}
      <div className="prose mb-8">
        <p className="text-[15px] text-t2 leading-relaxed whitespace-pre-wrap">{work.description}</p>
      </div>

      {/* Tags */}
      {work.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {work.tags.map((tag) => (
            <span key={tag} className="text-sm bg-bg2 text-t2 rounded-full px-3 py-1">#{tag}</span>
          ))}
        </div>
      )}
    </div>
  );
}
