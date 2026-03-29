import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { Plus } from "lucide-react";

export default async function AdminArticlesPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") redirect("/");

  const articles = await db.article.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true } }, category: true },
  });

  const statusColors: Record<string, string> = {
    published: "bg-green-50 text-grn-t",
    draft: "bg-bg2 text-t3",
    scheduled: "bg-ind-bg text-ind",
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-[500] text-t1">文章管理</h1>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          新增文章
        </Button>
      </div>

      <div className="rounded-xl border border-bd overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-bg2 border-b border-bd">
            <tr>
              {["標題", "分類", "狀態", "作者", "日期"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-medium text-t2">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-bd">
            {articles.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-t3">還沒有文章</td>
              </tr>
            ) : articles.map((article) => (
              <tr key={article.id} className="bg-white hover:bg-bg2">
                <td className="px-4 py-3">
                  <div className="font-medium text-t1 line-clamp-1">{article.title}</div>
                  {article.isPremium && <span className="text-xs text-amber">付費</span>}
                </td>
                <td className="px-4 py-3 text-t2">{article.category?.name || "—"}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[article.status]}`}>
                    {article.status === "published" ? "已發布" : article.status === "draft" ? "草稿" : "排程"}
                  </span>
                </td>
                <td className="px-4 py-3 text-t2">{article.author.name}</td>
                <td className="px-4 py-3 text-t3">{formatDate(article.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
