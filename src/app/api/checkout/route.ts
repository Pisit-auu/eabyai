import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const origin = req.headers.get("origin");

  const session = await stripe.checkout.sessions.create({
    success_url: `${origin}/`,
    cancel_url: `${origin}/`,
  });
}
