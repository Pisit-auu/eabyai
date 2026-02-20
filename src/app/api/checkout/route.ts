import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST() {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["promptpay"], // ไทยใช้ PromptPay ได้
      line_items: [
        {
          price_data: {
            currency: "thb",
            product_data: {
              name: "Test Payment",
            },
            unit_amount: 2000, // 100 บาท (หน่วยเป็นสตางค์)
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "error" }, { status: 500 });
  }
}