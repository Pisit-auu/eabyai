import Stripe from 'stripe';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    // 👉 1. รับค่า billId เพิ่มเติมจากหน้าบ้าน
    const { amount, billId, license,email,commission} = await req.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['promptpay'], 
      line_items: [
        {
          price_data: {
            currency: 'thb',
            product_data: { name: `ค่าบริการ EA (บิล #${billId})` },
            unit_amount: Math.round(amount * 100), // ป้องกันเศษทศนิยม
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      // 👉 2. ฝาก billId ไปกับ Stripe ตรงนี้สำคัญมาก!
      metadata: {
        billId: billId,
        license: license,
        email,
        commission 
      },
      success_url: `${req.headers.get('origin')}/Bill`,
      cancel_url: `${req.headers.get('origin')}/Bill`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}