import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CtaSection() {
  return (
    <section className="py-24 bg-ind">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
        <h2
          className="text-3xl md:text-4xl font-[500] text-white mb-5 leading-tight"
          style={{ wordBreak: "keep-all" }}
        >
          你的下一份企劃，
          <br />
          不應該只是普通
        </h2>
        <p className="text-ind-bg text-[17px] mb-10" style={{ wordBreak: "keep-all" }}>
          加入創新先生，學習用 AI 做出真正有差異化的成果。
          <br />
          今天就開始，完全免費。
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            size="lg"
            className="bg-white text-ind hover:bg-ind-bg gap-2"
            asChild
          >
            <Link href="/auth/register">
              免費加入創新先生
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10"
            asChild
          >
            <Link href="/articles">先看看文章</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
