import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

interface Props {
  isPremium: boolean;
  canAccess: boolean;
  children: React.ReactNode;
}

export function PaywallGate({ isPremium, canAccess, children }: Props) {
  if (!isPremium || canAccess) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {/* Free preview - first 300 words */}
      <div className="paywall-content">
        <div className="[&>*:nth-child(n+4)]:hidden">{children}</div>
      </div>

      {/* Blur overlay */}
      <div className="relative mt-[-120px]">
        <div className="h-32 bg-gradient-to-t from-bg via-bg/80 to-transparent" />
        <div className="bg-bg pt-4 pb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-ind-bg mb-4">
            <Lock className="h-5 w-5 text-ind" />
          </div>
          <h3 className="text-lg font-[500] text-t1 mb-2">這是付費文章</h3>
          <p className="text-t2 text-sm mb-6 max-w-sm mx-auto">
            升級為月訂閱會員，即可閱讀全部付費文章，以及使用完整工具庫。
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild>
              <Link href="/pricing">升級查看全文</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/auth/login">已有帳號？登入</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
