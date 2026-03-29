import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function BillingPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/auth/login");

  const user = await db.user.findUnique({ where: { id: session.user.id } });
  if (!user) redirect("/");

  const roleLabels: Record<string, string> = {
    free: "免費會員", pro: "月訂閱會員", diamond: "鑽石年訂閱", admin: "管理員",
  };

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-[500] text-t1 mb-8">帳務資訊</h1>

      {/* Current Plan */}
      <div className="rounded-xl border border-bd bg-white p-6 mb-6">
        <h2 className="font-medium text-t1 mb-4">目前方案</h2>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium text-t1">{roleLabels[user.role]}</div>
            {user.subscriptionEnd && (
              <div className="text-sm text-t2 mt-1">有效期至：{formatDate(user.subscriptionEnd)}</div>
            )}
          </div>
          <Link href="/pricing">
            <Button variant="outline" size="sm">變更方案</Button>
          </Link>
        </div>
      </div>

      {/* Cancel */}
      {(user.role === "pro" || user.role === "diamond") && (
        <div className="rounded-xl border border-red/20 bg-red/5 p-6">
          <h2 className="font-medium text-t1 mb-2">取消訂閱</h2>
          <p className="text-sm text-t2 mb-4">
            取消後，訂閱將在 {user.subscriptionEnd ? formatDate(user.subscriptionEnd) : "期末"} 到期。到期前仍保有完整存取權。
          </p>
          <form action="/api/stripe/cancel" method="POST">
            <Button type="submit" variant="destructive" size="sm">取消訂閱</Button>
          </form>
        </div>
      )}
    </div>
  );
}
