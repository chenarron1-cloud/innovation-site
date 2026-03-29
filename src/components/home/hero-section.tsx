import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-bg py-20 md:py-32">
      {/* Background decoration */}
      <div
        className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 70% 50%, #2825A8 0%, transparent 60%)",
        }}
      />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center relative">
        {/* Tag */}
        <div className="inline-flex items-center gap-2 rounded-full bg-ind-bg border border-ind-bd px-4 py-1.5 text-xs font-medium text-ind mb-8">
          <Sparkles className="h-3.5 w-3.5" />
          AI 創新思維實戰平台
        </div>

        {/* H1 */}
        <h1
          className="text-4xl md:text-5xl lg:text-6xl font-[500] text-t1 leading-tight mb-6"
          style={{ wordBreak: "keep-all" }}
        >
          用創新思維，讓 AI 幫你
          <br />
          做出<em className="not-italic" style={{ color: "#1E1B6E" }}>不普通</em>的成果
        </h1>

        {/* Sub */}
        <p
          className="text-[17px] text-t2 leading-relaxed max-w-2xl mx-auto mb-10"
          style={{ wordBreak: "keep-all" }}
        >
          這不是教你怎麼問 AI 的網站，
          而是教你怎麼用創新思維，
          讓 AI 幫你做出更有差異化成果的平台。
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button size="lg" asChild className="gap-2">
            <Link href="/articles">
              開始探索
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/works">看學員成果</Link>
          </Button>
        </div>

        {/* Social proof */}
        <div className="mt-12 flex items-center justify-center gap-6 text-sm text-t3">
          <div className="flex items-center gap-1.5">
            <div className="flex -space-x-2">
              {["陳", "林", "張", "王"].map((char, i) => (
                <div
                  key={i}
                  className="h-7 w-7 rounded-full bg-ind-bg border-2 border-bg flex items-center justify-center text-xs font-medium text-ind"
                >
                  {char}
                </div>
              ))}
            </div>
            <span>已有 1,000+ 人使用</span>
          </div>
          <span>·</span>
          <span>500+ 篇 AI 創新文章</span>
        </div>
      </div>
    </section>
  );
}
