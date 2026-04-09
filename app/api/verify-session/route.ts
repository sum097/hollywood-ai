import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
});

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json();

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });

    if (session.payment_status === "paid") {
      const priceId = session.line_items?.data?.[0]?.price?.id;
      const plan = priceId === process.env.STRIPE_VIP_PRICE_ID ? "vip+" : "premium";
      return NextResponse.json({ plan });
    }

    return NextResponse.json({ plan: null });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}