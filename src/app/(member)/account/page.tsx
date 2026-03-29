import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/auth/login");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      works: { where: { status: { in: ["approved", "featured", "pending"] } }, orderBy: { createdAt: "desc" }, take: 10 },
    },
  });
  if (!user) redirect("/");

  const roleLabels: Record<string, string> = {
    free: "免費會員", pro: "月訂閱會員", diamond: "鑽石年訂閱", admin: "管理員",
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-[500] text-t1 mb-8">我的帳戶</h1>

      {/* Profile */}
      <div className="rounded-xl border border-bd bg-white p-6 mb-6">
        <h2 className="font-medium text-t1 mb-4">個人資料</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-t2">姓名</span>
            <span className="text-t1">{user.name || "未設定"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-t2">Email</span>
            <span className="text-t1">{user.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-t2">加入日期</span>
            <span className="text-t1">{formatDate(user.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Subscription */}
      <div className="rounded-xl border border-bd bg-white p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-medium text-t1">目前方案</h2>
          <Link href="/pricing">
            <Button size="sm" variant="outline">升級方案</Button>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <div className={`rounded-full px-3 py-1 text-sm font-medium ${
            user.role === "diamond" ? "bg-amber/10 text-amber" :
            user.role === "pro" ? "bg-ind-bg text-ind" :
            "bg-bg2 text-t2"
          }`}>
            {roleLabels[user.role]}
          </div>
          {user.subscriptionEnd && (
            <span className="text-sm text-t2">到期：{formatDate(user.subscriptionEnd)}</span>
          )}
        </div>
        {(user.role === "pro" || user.role === "diamond") && (
          <div className="mt-4">
            <Link href="/account/billing">
              <Button size="sm" variant="ghost" className="text-xs text-t3 hover:text-red">管理訂閱 / 取消</Button>
            </Link>
          </div>
        )}
      </div>

      {/* My Works */}
      <div className="rounded-xl border border-bd bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-medium text-t1">我的作品</h2>
          <Link href="/works">
            <Button size="sm" variant="outline">上傳作品</Button>
          </Link>
        </div>
        {user.works.length === 0 ? (
          <p className="text-sm text-t3">還沒有上傳作品</p>
        ) : (
          <div className="space-y-3">
            {user.works.map((work) => (
              <Link key={work.id} href={`/works/${work.id}`} className="flex items-center gap-3 hover:text-ind">
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  work.status === "approved" || work.status === "featured" ? "bg-green-50 text-grn-t" :
                  work.status === "pending" ? "bg-bg2 text-t3" :
                  "bg-red/10 text-red"
                }`}>
                  {work.status === "approved" ? "已公開" : work.status === "featured" ? "精選" : work.status === "pending" ? "審核中" : "已退件"}
                </span>
                <span className="text-sm text-t1 flex-1 truncate">{work.title}</span>
                <span className="text-xs text-t3">❤️ {work.voteCount}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
