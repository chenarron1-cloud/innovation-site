import Link from "next/link";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Lock } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI 創新文章",
  description: "深度文章：用創新思維結合 AI，做出差異化成果。每週更新，免費與付費文章混合。",
};

export const dynamic = "force-dynamic";

export default async function ArticlesPage() {
  const articles = await db.article.findMany({
    where: { status: "published" },
    orderBy: { publishedAt: "desc" },
    include: { author: { select: { name: true } }, category: true },
    take: 24,
  });

  const categories = await db.category.findMany();

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-[36px] font-[500] text-t1 mb-3">AI 創新文章</h1>
        <p className="text-t2 text-[17px]">深度好文，教你用創新思維做出差異化成果</p>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-4xl mb-4">📝</div>
          <p className="text-t2">文章即將上線，敬請期待！</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Link key={article.id} href={`/articles/${article.slug}`} className="group">
              <div className="h-full rounded-xl border border-bd bg-white p-5 hover:border-ind-bd hover:shadow-sm transition-all">
                {/* Cover */}
                {article.coverImage && (
                  <div className="w-full aspect-video rounded-lg bg-bg2 mb-4 overflow-hidden">
                    <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover" />
                  </div>
                )}

                {/* Meta */}
                <div className="flex items-center gap-2 mb-3">
                  {article.category && (
                    <Badge variant="default" className="text-xs">{article.category.name}</Badge>
                  )}
                  {article.isPremium && (
                    <span className="flex items-center gap-1 text-xs text-amber font-medium">
                      <Lock className="h-3 w-3" />付費
                    </span>
                  )}
                </div>

                <h2 className="text-[15px] font-[500] text-t1 mb-2 line-clamp-2 group-hover:text-ind transition-colors">
                  {article.title}
                </h2>

                {article.excerpt && (
                  <p className="text-sm text-t2 line-clamp-3 mb-4 leading-relaxed">{article.excerpt}</p>
                )}

                <div className="flex items-center justify-between text-xs text-t3">
                  <span>{article.author.name}</span>
                  <span>{article.publishedAt ? formatDate(article.publishedAt) : ""}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
