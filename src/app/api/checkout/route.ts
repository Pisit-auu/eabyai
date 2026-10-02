import Stripe from 'stripe';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
/**
 * @swagger
 * /api/checkout:
 *   post:
 *     summary: สร้าง Stripe Checkout Session (PromptPay)
 *     description: |
 *       API สำหรับสร้าง Stripe Checkout Session
 *       เพื่อชำระค่าบริการ EA โดยส่งข้อมูล bill และ metadata ไปกับ Stripe
 *     tags:
 *       - Payment
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - billId
 *               - license
 *               - email
 *               - commission
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 500
 *                 description: จำนวนเงิน (บาท)
 *               billId:
 *                 type: string
 *                 example: "123"
 *                 description: เลขบิล
 *               license:
 *                 type: string
 *                 example: ABCD-1234-EFGH
 *                 description: license key
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@email.com
 *               commission:
 *                 type: number
 *                 example: 10
 *                 description: ค่าคอมมิชชั่น (% หรือจำนวนตามระบบ)
 *
 *     responses:
 *       200:
 *         description: สร้าง Checkout Session สำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   example: https://checkout.stripe.com/c/pay/cs_test_xxxxx
 *
 *       500:
 *         description: Stripe Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Stripe error message
 */
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
      metadata: {
      billId: String(billId),
      license: String(license),
      email: String(email),
      commission: String(commission)
    },
    success_url: "https://ea-by-ai.com/Bill",
    cancel_url: "https://ea-by-ai.com/Bill",
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}