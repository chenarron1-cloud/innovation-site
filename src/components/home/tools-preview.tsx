import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Zap, ArrowRight } from "lucide-react";

const previewTools = [
  { name: "創新企劃生成器", desc: "輸入你的目標，AI 幫你生成有差異化的企劃框架", category: "企劃" },
  { name: "競品差異化分析", desc: "分析競品弱點，找出你的差異化切入點", category: "行銷" },
  { name: "課程大綱設計師", desc: "用創新思維設計吸引人的課程結構", category: "教育" },
  { name: "銷售文案優化器", desc: "讓你的文案更有說服力，轉換率提升", category: "銷售" },
];

export function ToolsPreview() {
  return (
    <section className="py-20 bg-bg2">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl font-[500] text-t1 mb-2">AI 創新工具庫</h2>
            <p className="text-t2 text-[15px]">每個工具都內建創新思維框架，讓 AI 的輸出更有差異化</p>
          </div>
          <Button variant="ghost" size="sm" asChild className="hidden sm:flex gap-1">
            <Link href="/tools">
              查看全部
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {previewTools.map((tool, i) => (
            <Link key={i} href="/tools" className="group">
              <div className="h-full rounded-xl border border-bd bg-white p-5 hover:border-ind-bd hover:shadow-sm transition-all">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-ind-bg flex items-center justify-center">
                    <Zap className="h-4 w-4 text-ind" />
                  </div>
                  <span className="text-xs text-ind bg-ind-bg rounded-full px-2 py-0.5">
                    {tool.category}
                  </span>
                </div>
                <h3 className="text-[15px] font-[500] text-t1 mb-2 group-hover:text-ind transition-colors">
                  {tool.name}
                </h3>
                <p className="text-sm text-t2 leading-relaxed">{tool.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6 sm:hidden text-center">
          <Button variant="outline" size="sm" asChild>
            <Link href="/tools">查看全部工具</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
