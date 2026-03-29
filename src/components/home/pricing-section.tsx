import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const plans = [
  {
    name: "免費會員",
    price: "$0",
    period: "永久免費",
    tagline: "嘗鮮者",
    description: "看見 AI 可以做出不普通成果的可能性",
    cta: "立刻免費加入",
    ctaHref: "/auth/register",
    variant: "outline" as const,
    features: [
      "免費文章全部閱讀",
      "免費 AI 課程",
      "基本工具庫",
      "作品投票區瀏覽",
      "登入後可投票（每件1票）",
      "許願池投票 + 許願",
    ],
    excluded: ["進階付費文章", "上傳作品", "付費課程"],
  },
  {
    name: "月訂閱會員",
    price: "$299",
    period: "/ 月",
    tagline: "實戰者",
    description: "加入後，你的下一份企劃將不再普通",
    cta: "開始月訂閱",
    ctaHref: "/pricing",
    variant: "default" as const,
    highlight: true,
    features: [
      "所有文章無限閱讀",
      "全部課程（部分付費）",
      "完整工具庫 + 模板",
      "✦ 上傳作品（月最多3件）",
      "作品投票 + 排行榜",
      "許願池優先回應",
    ],
    excluded: ["會員專屬直播 / QA"],
  },
  {
    name: "鑽石年訂閱",
    price: "$2490",
    period: "/ 年",
    tagline: "創新者",
    description: "建立你自己的 AI 創新思維系統",
    cta: "成為鑽石會員",
    ctaHref: "/pricing",
    variant: "outline" as const,
    badge: "最超值",
    features: [
      "所有文章 + 課程無限閱讀",
      "完整工具庫 + 模板",
      "✦ 上傳作品",
      "✦ 創新先鋒徽章資格",
      "✦ 首頁精選展示資格",
      "會員專屬直播 / QA",
    ],
    excluded: [],
  },
];

export function PricingSection() {
  return (
    <section className="py-20 bg-bg" id="pricing">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-2xl font-[500] text-t1 mb-3">選擇你的創新之旅</h2>
          <p className="text-t2 text-[15px]">三種方案，找到最適合你的步調</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border p-6 flex flex-col ${
                plan.highlight
                  ? "border-ind bg-white shadow-lg shadow-ind/10 scale-[1.02]"
                  : "border-bd bg-white"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-ind text-white text-xs font-medium px-3 py-1 rounded-full">
                    最多人選擇
                  </span>
                </div>
              )}
              {plan.badge && (
                <div className="absolute -top-3 right-4">
                  <span className="bg-amber text-white text-xs font-medium px-3 py-1 rounded-full">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <div className="text-xs font-medium text-ind tracking-wider mb-1">
                  {plan.tagline}
                </div>
                <h3 className="text-lg font-[500] text-t1 mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-3xl font-bold text-t1">{plan.price}</span>
                  <span className="text-sm text-t2">{plan.period}</span>
                </div>
                <p className="text-sm text-t2">{plan.description}</p>
              </div>

              <ul className="space-y-2.5 mb-8 flex-1">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-t1">
                    <Check className="h-4 w-4 text-grn-t mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Button variant={plan.variant} asChild className="w-full">
                <Link href={plan.ctaHref}>{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
