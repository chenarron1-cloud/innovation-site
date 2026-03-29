"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle } from "lucide-react";

const audiences = [
  { id: "worker", label: "上班族 / 職場工作者", icon: "💼" },
  { id: "entrepreneur", label: "創業者 / 自由工作者", icon: "🚀" },
  { id: "marketing", label: "行銷 / 產品人員", icon: "📊" },
  { id: "educator", label: "教育者 / 課程設計師", icon: "📚" },
  { id: "sales", label: "企劃與銷售人員", icon: "🎯" },
];

const recommendations: Record<string, { text: string; links: { label: string; href: string }[] }> = {
  worker: {
    text: "你需要學會用 AI 提升工作品質、讓企劃和報告更有說服力。",
    links: [
      { label: "職場 AI 應用文章", href: "/topics/workplace" },
      { label: "工作效率工具", href: "/tools" },
    ],
  },
  entrepreneur: {
    text: "你需要用創新思維快速驗證想法，讓 AI 加速你的執行力。",
    links: [
      { label: "創業創新案例", href: "/cases" },
      { label: "商業模式工具", href: "/tools" },
    ],
  },
  marketing: {
    text: "你需要差異化的行銷策略，讓 AI 幫你產出高轉換文案。",
    links: [
      { label: "行銷創新文章", href: "/topics/marketing" },
      { label: "文案生成工具", href: "/tools" },
    ],
  },
  educator: {
    text: "你需要用 AI 設計更有吸引力的課程與學習體驗。",
    links: [
      { label: "課程設計文章", href: "/topics/education" },
      { label: "課程設計工具", href: "/tools" },
    ],
  },
  sales: {
    text: "你需要 AI 助你打造更有說服力的銷售企劃與提案。",
    links: [
      { label: "銷售企劃案例", href: "/cases" },
      { label: "提案優化工具", href: "/tools" },
    ],
  },
};

export function DiagnosisSection() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <section className="py-20 bg-bg2">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-[500] text-t1 mb-3">你是哪種類型？</h2>
          <p className="text-t2 text-[15px]">選擇你的身份，獲得最適合你的學習路徑</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          {audiences.map((a) => (
            <button
              key={a.id}
              onClick={() => setSelected(a.id)}
              className={cn(
                "flex items-center gap-3 rounded-xl border p-4 text-left transition-all",
                selected === a.id
                  ? "border-ind bg-ind-bg shadow-sm"
                  : "border-bd bg-white hover:border-ind-bd"
              )}
            >
              <span className="text-2xl">{a.icon}</span>
              <span className="text-sm font-medium text-t1">{a.label}</span>
              <span className="ml-auto">
                {selected === a.id ? (
                  <CheckCircle2 className="h-5 w-5 text-ind" />
                ) : (
                  <Circle className="h-5 w-5 text-t3" />
                )}
              </span>
            </button>
          ))}
        </div>

        {selected && recommendations[selected] && (
          <div className="rounded-xl border border-ind-bd bg-ind-bg p-6 animate-in fade-in">
            <p className="text-[15px] text-t1 mb-4">{recommendations[selected].text}</p>
            <div className="flex flex-wrap gap-3">
              {recommendations[selected].links.map((link) => (
                <Button key={link.href} variant="outline" size="sm" asChild>
                  <a href={link.href}>{link.label}</a>
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
