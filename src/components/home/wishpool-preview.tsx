import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ThumbsUp } from "lucide-react";

const wishes = [
  { title: "希望有 YouTube 腳本的創新框架教學", votes: 89, status: "in_progress" },
  { title: "想要更多 B2B 銷售提案的案例分析", votes: 67, status: "pending" },
  { title: "希望有針對電商的 AI 工具整合課程", votes: 54, status: "completed" },
];

const statusLabel: Record<string, { label: string; color: string }> = {
  pending: { label: "收到許願", color: "text-t3 bg-bg2" },
  in_progress: { label: "製作中", color: "text-ind bg-ind-bg" },
  completed: { label: "已完成", color: "text-grn-t bg-green-50" },
};

export function WishpoolPreview() {
  return (
    <section className="py-20 bg-bg2">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-[500] text-t1 mb-3">許願池</h2>
          <p className="text-t2 text-[15px]">告訴我你想學什麼，高票許願優先製作</p>
        </div>

        <div className="space-y-3 mb-8">
          {wishes.map((wish, i) => {
            const s = statusLabel[wish.status];
            return (
              <div key={i} className="flex items-center gap-4 rounded-xl border border-bd bg-white p-4">
                <div className="flex-1">
                  <p className="text-[15px] text-t1">{wish.title}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${s.color}`}>
                  {s.label}
                </span>
                <div className="flex items-center gap-1.5 text-sm text-t2 min-w-[48px] justify-end">
                  <ThumbsUp className="h-4 w-4 text-ind" />
                  {wish.votes}
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <Button variant="outline" asChild className="gap-2">
            <Link href="/wishpool">
              查看更多 + 投票
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
