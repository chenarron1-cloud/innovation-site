"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Heart, Eye, Trophy, Clock } from "lucide-react";
import { cn, getAvatarInitial, truncate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

const categoryLabels: Record<string, string> = {
  planning: "企劃",
  marketing: "行銷",
  product: "產品",
  course: "課程",
  sales: "銷售",
  other: "其他",
};

interface WorkCardProps {
  work: {
    id: string;
    title: string;
    description: string;
    category: string;
    imageUrl: string;
    tags: string[];
    voteCount: number;
    viewCount: number;
    createdAt: string | Date;
    isFeatured: boolean;
    user: { id: string; name?: string | null; image?: string | null; title?: string | null };
  };
  rank?: number;
  userVoted?: boolean;
}

export function WorkCard({ work, rank, userVoted: initialVoted = false }: WorkCardProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [voted, setVoted] = useState(initialVoted);
  const [voteCount, setVoteCount] = useState(work.voteCount);
  const [loading, setLoading] = useState(false);

  const isNew = new Date(work.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const isGold = rank === 1;

  async function handleVote(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      toast.error("請先登入才能投票");
      router.push("/auth/login");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/works/${work.id}/vote`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setVoted(data.voted);
        setVoteCount(data.voteCount);
        toast.success(data.voted ? "已投票！" : "已取消投票");
      } else {
        toast.error(data.error || "投票失敗");
      }
    } catch {
      toast.error("投票失敗，請稍後再試");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Link href={`/works/${work.id}`} className="group block">
      <div
        className={cn(
          "h-full rounded-xl border p-4 hover:shadow-md transition-all",
          isGold
            ? "border-yellow-300 bg-[#FFFDF5]"
            : "border-bd bg-white hover:border-ind-bd"
        )}
      >
        {/* Image */}
        <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-4 bg-bg2">
          <Image
            src={work.imageUrl}
            alt={work.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Rank badge */}
          {rank && rank <= 3 && (
            <div
              className={cn(
                "absolute top-2 left-2 flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full",
                rank === 1 ? "bg-yellow-100 text-amber border border-yellow-300" :
                rank === 2 ? "bg-gray-100 text-gray-600 border border-gray-200" :
                "bg-orange-50 text-orange-600 border border-orange-200"
              )}
            >
              {rank === 1 && <Trophy className="h-3 w-3" />}
              #{rank}
            </div>
          )}
          {/* New badge */}
          {isNew && (
            <div className="absolute top-2 right-2 bg-ind text-white text-xs font-medium px-2 py-0.5 rounded-full">
              新上傳
            </div>
          )}
        </div>

        {/* Author row */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-full bg-ind-bg flex items-center justify-center text-xs font-medium text-ind shrink-0">
            {work.user.image ? (
              <Image src={work.user.image} alt="" width={28} height={28} className="rounded-full" />
            ) : (
              getAvatarInitial(work.user.name)
            )}
          </div>
          <span className="text-xs text-t2 flex-1 truncate">{work.user.name || "匿名"}</span>
          {work.user.title && <span className="text-xs text-t3 hidden sm:block truncate max-w-[80px]">{work.user.title}</span>}
          <Badge variant="default" className="text-xs shrink-0">
            {categoryLabels[work.category] || work.category}
          </Badge>
        </div>

        {/* Title */}
        <h3 className="text-[15px] font-[500] text-t1 mb-2 line-clamp-2 group-hover:text-ind transition-colors">
          {work.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-t2 leading-relaxed line-clamp-3 mb-3">
          {work.description}
        </p>

        {/* Tags */}
        {work.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {work.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-xs bg-bg2 text-t2 rounded-full px-2 py-0.5">
                #{tag}
              </span>
            ))}
            {work.tags.length > 3 && (
              <span className="text-xs text-t3">+{work.tags.length - 3}</span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center gap-3 pt-3 border-t border-bd">
          <button
            onClick={handleVote}
            disabled={loading}
            className={cn(
              "flex items-center gap-1.5 text-sm font-medium rounded-lg px-3 py-1.5 transition-all",
              voted
                ? "bg-ind text-white"
                : "bg-bg2 text-t2 hover:bg-ind-bg hover:text-ind"
            )}
          >
            <Heart className={cn("h-3.5 w-3.5", voted && "fill-current")} />
            {voteCount}
          </button>
          <div className="flex items-center gap-1 text-xs text-t3 ml-auto">
            <Eye className="h-3.5 w-3.5" />
            {work.viewCount}
          </div>
        </div>
      </div>
    </Link>
  );
}
