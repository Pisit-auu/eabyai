import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    const origin =
        req.headers.get("origin") ||
        "https://eawithai.vercel.app";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["promptpay"],
      line_items: [
        {
          price_data: {
            currency: "thb",
            product_data: { name: "Test Payment" },
            unit_amount: 1000,
          },
          quantity: 1,
        },
      ],
      success_url: "https://eawithai.vercel.app/success",
    cancel_url: "https://eawithai.vercel.app/cancel",
    });

    return Response.json({ url: session.url });

  } catch (err) {
    console.error(err);
    return Response.json({ error: "failed" }, { status: 500 });
  }
}