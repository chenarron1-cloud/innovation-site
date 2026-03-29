import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export default async function AdminMembersPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") redirect("/");

  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    select: { id: true, name: true, email: true, role: true, createdAt: true, subscriptionEnd: true },
  });

  const roleColors: Record<string, string> = {
    free: "bg-bg2 text-t2",
    pro: "bg-ind-bg text-ind",
    diamond: "bg-amber/10 text-amber",
    admin: "bg-red/10 text-red",
  };

  const roleLabels: Record<string, string> = {
    free: "免費", pro: "月訂閱", diamond: "鑽石年", admin: "管理員",
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-[500] text-t1 mb-8">會員管理</h1>

      <div className="rounded-xl border border-bd overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-bg2 border-b border-bd">
            <tr>
              {["姓名", "Email", "方案", "加入日期", "訂閱到期"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-medium text-t2">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-bd">
            {users.map((user) => (
              <tr key={user.id} className="bg-white hover:bg-bg2">
                <td className="px-4 py-3 font-medium text-t1">{user.name || "—"}</td>
                <td className="px-4 py-3 text-t2">{user.email}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleColors[user.role]}`}>
                    {roleLabels[user.role]}
                  </span>
                </td>
                <td className="px-4 py-3 text-t3">{formatDate(user.createdAt)}</td>
                <td className="px-4 py-3 text-t3">
                  {user.subscriptionEnd ? formatDate(user.subscriptionEnd) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
