import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-02-24.acacia",
      typescript: true,
    });
  }
  return _stripe;
}

// Lazy singleton — only used in API routes at request time
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return (getStripe() as any)[prop];
  },
});

export const PLANS = {
  free: { name: "免費會員", price: 0, role: "free" as const },
  pro: { name: "月訂閱會員", price: 299, role: "pro" as const, priceId: process.env.STRIPE_PRICE_MONTHLY },
  diamond: { name: "鑽石年訂閱", price: 2490, role: "diamond" as const, priceId: process.env.STRIPE_PRICE_ANNUAL },
} as const;
