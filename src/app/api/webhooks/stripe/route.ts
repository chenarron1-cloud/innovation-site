export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  async function getUserByCustomerId(customerId: string) {
    return db.user.findFirst({ where: { stripeCustomerId: customerId } });
  }

  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const user = await getUserByCustomerId(sub.customer as string);
      if (!user) break;

      const priceId = sub.items.data[0]?.price.id;
      const isAnnual = priceId === process.env.STRIPE_PRICE_ANNUAL;
      const role = sub.status === "active" ? (isAnnual ? "diamond" : "pro") : "free";

      await db.user.update({
        where: { id: user.id },
        data: {
          role: role as any,
          subscriptionId: sub.id,
          subscriptionEnd: new Date(sub.current_period_end * 1000),
        },
      });
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const user = await getUserByCustomerId(sub.customer as string);
      if (!user) break;
      await db.user.update({
        where: { id: user.id },
        data: { role: "free", subscriptionId: null, subscriptionEnd: null },
      });
      break;
    }

    case "invoice.payment_succeeded": {
      const inv = event.data.object as Stripe.Invoice;
      const user = await getUserByCustomerId(inv.customer as string);
      if (!user || !inv.subscription) break;

      const sub = await stripe.subscriptions.retrieve(inv.subscription as string);
      const priceId = sub.items.data[0]?.price.id;
      const isAnnual = priceId === process.env.STRIPE_PRICE_ANNUAL;

      await db.user.update({
        where: { id: user.id },
        data: {
          role: isAnnual ? "diamond" : ("pro" as any),
          subscriptionEnd: new Date(sub.current_period_end * 1000),
        },
      });
      break;
    }

    case "invoice.payment_failed": {
      // Could send email notification here
      break;
    }
  }

  return NextResponse.json({ received: true });
}
