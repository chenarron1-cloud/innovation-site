import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { AdminWorksClient } from "./client";

export default async function AdminWorksPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") redirect("/");

  const pending = await db.work.findMany({
    where: { status: "pending" },
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true } } },
  });

  const approved = await db.work.findMany({
    where: { status: { in: ["approved", "featured"] } },
    orderBy: { createdAt: "desc" },
    take: 20,
    include: { user: { select: { name: true, email: true } } },
  });

  return <AdminWorksClient pending={pending as any[]} approved={approved as any[]} />;
}
