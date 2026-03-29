export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  const user = await db.user.findUnique({ where: { id: session.user.id } });
  if (!user?.subscriptionId) {
    return NextResponse.redirect(new URL("/account/billing", req.url));
  }

  await stripe.subscriptions.update(user.subscriptionId, { cancel_at_period_end: true });

  return NextResponse.redirect(new URL("/account/billing?canceled=true", req.url));
}
