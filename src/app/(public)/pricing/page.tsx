"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import type { Metadata } from "next";

const plans = [
  {
    key: "free",
    name: "免費會員",
    price: "NT$0",
    period: "永久免費",
    tagline: "嘗鮮者",
    description: "看見 AI 可以做出不普通成果的可能性",
    features: ["免費文章全部閱讀", "免費 AI 課程", "基本工具庫", "作品投票區瀏覽 + 投票", "許願池投票 + 許願"],
  },
  {
    key: "pro",
    name: "月訂閱會員",
    price: "NT$299",
    period: "/ 月",
    tagline: "實戰者",
    description: "加入後，你的下一份企劃將不再普通",
    highlight: true,
    features: ["所有文章無限閱讀", "全部課程", "完整工具庫 + 模板", "上傳作品（每月3件）", "許願池優先回應"],
  },
  {
    key: "diamond",
    name: "鑽石年訂閱",
    price: "NT$2490",
    period: "/ 年",
    tagline: "創新者",
    description: "建立你自己的 AI 創新思維系統",
    badge: "省 NT$1098",
    features: ["所有文章 + 課程", "完整工具庫 + 模板", "上傳作品", "創新先鋒徽章資格", "首頁精選展示資格", "會員專屬直播 / QA"],
  },
];

export default function PricingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function subscribe(planKey: string) {
    if (planKey === "free") {
      router.push("/auth/register");
      return;
    }

    if (!session) {
      router.push("/auth/login?callbackUrl=/pricing");
      return;
    }

    setLoading(planKey);
    try {
      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planKey }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("建立訂閱失敗，請稍後再試");
      }
    } catch {
      toast.error("系統錯誤，請稍後再試");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-14">
        <h1 className="text-[36px] font-[500] text-t1 mb-4">選擇你的創新之旅</h1>
        <p className="text-t2 text-[17px]">三種方案，找到最適合你的步調</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.key}
            className={`relative rounded-2xl border p-7 flex flex-col ${
              plan.highlight ? "border-ind shadow-xl shadow-ind/10 scale-[1.02]" : "border-bd bg-white"
            }`}
          >
            {plan.highlight && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="bg-ind text-white text-xs font-medium px-3 py-1 rounded-full">最多人選擇</span>
              </div>
            )}
            {plan.badge && (
              <div className="absolute -top-3.5 right-4">
                <span className="bg-amber text-white text-xs font-medium px-3 py-1 rounded-full">{plan.badge}</span>
              </div>
            )}

            <div className="mb-7">
              <div className="text-xs font-medium text-ind tracking-wider mb-1">{plan.tagline}</div>
              <h3 className="text-xl font-[500] text-t1 mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-bold text-t1">{plan.price}</span>
                <span className="text-sm text-t2">{plan.period}</span>
              </div>
              <p className="text-sm text-t2">{plan.description}</p>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {plan.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-t1">
                  <Check className="h-4 w-4 text-grn-t mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            <Button
              variant={plan.highlight ? "default" : "outline"}
              className="w-full"
              onClick={() => subscribe(plan.key)}
              disabled={loading === plan.key}
            >
              {loading === plan.key && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {plan.key === "free" ? "免費加入" : "立即訂閱"}
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center text-sm text-t3">
        所有付費方案均可隨時取消。付款後資格立即生效。
        <br />
        有問題？請 <Link href="/about" className="text-ind hover:underline">聯絡我們</Link>
      </div>
    </div>
  );
}
