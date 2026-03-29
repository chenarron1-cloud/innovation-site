import type { Metadata } from "next";
import { db } from "@/lib/db";
import Link from "next/link";
import { Zap, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "AI 創新工具庫",
  description: "每個工具都內建創新思維框架，讓 AI 輸出更有差異化。",
};

export const dynamic = "force-dynamic";

export default async function ToolsPage() {
  const tools = await db.tool.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-[36px] font-[500] text-t1 mb-3">AI 創新工具庫</h1>
      <p className="text-t2 text-[17px] mb-10">每個工具都內建創新思維框架，讓 AI 幫你做出差異化成果</p>

      {tools.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-4xl mb-4">🔧</div>
          <p className="text-t3">工具即將上線，敬請期待！</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {tools.map((tool) => (
            <Link key={tool.id} href={`/tools/${tool.slug}`} className="group">
              <div className="h-full rounded-xl border border-bd bg-white p-5 hover:border-ind-bd hover:shadow-sm transition-all">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-ind-bg flex items-center justify-center">
                    <Zap className="h-5 w-5 text-ind" />
                  </div>
                  {tool.isPremium && <Lock className="h-4 w-4 text-amber" />}
                  {tool.category && <Badge variant="default" className="text-xs ml-auto">{tool.category}</Badge>}
                </div>
                <h3 className="text-[15px] font-[500] text-t1 mb-2 group-hover:text-ind transition-colors">
                  {tool.name}
                </h3>
                {tool.description && (
                  <p className="text-sm text-t2 leading-relaxed line-clamp-3">{tool.description}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
