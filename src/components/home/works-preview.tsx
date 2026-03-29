import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Trophy, Heart } from "lucide-react";

const sampleWorks = [
  {
    title: "用 AI 重新設計 IG 內容策略，觸及率提升 3 倍",
    author: "林小華",
    category: "行銷",
    votes: 128,
    views: 890,
    emoji: "📊",
    rank: 1,
  },
  {
    title: "AI 輔助課程設計：讓學生完課率從 40% 到 85%",
    author: "張老師",
    category: "教育",
    votes: 96,
    views: 654,
    emoji: "📚",
    rank: 2,
  },
  {
    title: "用創新思維框架打造的 SaaS 商業計劃書",
    author: "王創業",
    category: "企劃",
    votes: 74,
    views: 512,
    emoji: "🚀",
    rank: 3,
  },
];

export function WorksPreview() {
  return (
    <section className="py-20 bg-bg">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl font-[500] text-t1 mb-2">AI 作品創意比一比</h2>
            <p className="text-t2 text-[15px]">看看其他人用 AI 做出了什麼不普通的成果</p>
          </div>
          <Button variant="ghost" size="sm" asChild className="hidden sm:flex gap-1">
            <Link href="/works">
              查看全部
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {sampleWorks.map((work) => (
            <Link key={work.rank} href="/works" className="group">
              <div
                className={`h-full rounded-xl border p-5 hover:shadow-sm transition-all ${
                  work.rank === 1
                    ? "border-yellow-300 bg-[#FFFDF5]"
                    : "border-bd bg-white hover:border-ind-bd"
                }`}
              >
                {/* Rank badge */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-medium rounded-full px-2.5 py-1 ${
                      work.rank === 1
                        ? "bg-yellow-100 text-amber"
                        : "bg-bg2 text-t2"
                    }`}
                  >
                    {work.rank === 1 && <Trophy className="h-3 w-3" />}#
                    {work.rank}
                  </span>
                  <span className="text-xs text-ind bg-ind-bg rounded-full px-2 py-0.5">
                    {work.category}
                  </span>
                </div>

                {/* Cover placeholder */}
                <div className="w-full aspect-video rounded-lg bg-bg2 flex items-center justify-center text-4xl mb-4">
                  {work.emoji}
                </div>

                <h3 className="text-[15px] font-[500] text-t1 mb-3 line-clamp-2 group-hover:text-ind transition-colors">
                  {work.title}
                </h3>

                <div className="flex items-center justify-between text-sm text-t3">
                  <span>{work.author}</span>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Heart className="h-3.5 w-3.5" />
                      {work.votes}
                    </span>
                    <span>{work.views} 瀏覽</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button asChild>
            <Link href="/works" className="gap-2">
              查看全部作品 + 投票
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
