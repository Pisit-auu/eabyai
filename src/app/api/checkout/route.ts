import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    const session = await stripe.checkout.sessions.create({
      // ...
    });

    return Response.json({ url: session.url });

  } catch (err) {
    console.error(err);

    return Response.json(
      { error: "checkout failed" },
      { status: 500 }
    );
  }
}