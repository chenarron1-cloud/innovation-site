import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { status, rejectReason } = await req.json();
  const validStatuses = ["approved", "rejected", "featured", "pending"];
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const work = await db.work.update({
    where: { id: params.id },
    data: {
      status,
      ...(status === "approved" || status === "featured" ? { approvedAt: new Date() } : {}),
      ...(status === "featured" ? { isFeatured: true } : {}),
    },
    include: { user: { select: { email: true, name: true } } },
  });

  // Log admin action
  await db.auditLog.create({
    data: {
      userId: session.user.id,
      action: `work_${status}`,
      entity: "Work",
      entityId: params.id,
      details: rejectReason,
    },
  });

  // TODO: Send email notification via Resend
  // if (status === "approved") sendApprovalEmail(work.user.email, work.title)
  // if (status === "rejected") sendRejectionEmail(work.user.email, work.title, rejectReason)

  return NextResponse.json(work);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await db.work.update({ where: { id: params.id }, data: { status: "rejected" } });
  return NextResponse.json({ success: true });
}
