import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import { Users, FileText, Trophy, TrendingUp } from "lucide-react";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") redirect("/");

  const [totalUsers, paidUsers, totalWorks, pendingWorks] = await Promise.all([
    db.user.count(),
    db.user.count({ where: { role: { in: ["pro", "diamond"] } } }),
    db.work.count(),
    db.work.count({ where: { status: "pending" } }),
  ]);

  const stats = [
    { label: "總用戶數", value: totalUsers, icon: Users, href: "/admin/members" },
    { label: "付費會員", value: paidUsers, icon: TrendingUp, href: "/admin/members" },
    { label: "作品總數", value: totalWorks, icon: Trophy, href: "/admin/works" },
    { label: "待審核", value: pendingWorks, icon: FileText, href: "/admin/works", urgent: pendingWorks > 0 },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-[500] text-t1 mb-8">後台管理</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="group">
            <div className={`rounded-xl border p-5 hover:shadow-sm transition-all ${s.urgent ? "border-red/20 bg-red/5" : "border-bd bg-white"}`}>
              <s.icon className={`h-5 w-5 mb-3 ${s.urgent ? "text-red" : "text-ind"}`} />
              <div className="text-2xl font-bold text-t1">{s.value}</div>
              <div className="text-sm text-t2 mt-1">{s.label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "文章管理", href: "/admin/articles" },
          { label: "作品審核", href: "/admin/works" },
          { label: "會員管理", href: "/admin/members" },
          { label: "SEO 設定", href: "/admin/seo" },
        ].map((link) => (
          <Link key={link.href} href={link.href}>
            <div className="rounded-xl border border-bd bg-white p-4 text-sm font-medium text-t1 hover:border-ind-bd hover:text-ind transition-all text-center">
              {link.label}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
