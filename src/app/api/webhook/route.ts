import Stripe from "stripe";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; 
import { addDays } from "date-fns";
export const runtime = "nodejs";
/**
 * @swagger
 * /api/webhook:
 *   post:
 *     summary: Stripe Webhook Endpoint
 *     description: |
 *       Endpoint สำหรับรับ Webhook จาก Stripe
 *       ใช้ตรวจสอบ event การชำระเงิน เช่น:
 *       - checkout.session.completed
 *
 *       เมื่อชำระเงินสำเร็จ ระบบจะ:
 *       1. อัปเดต bill ให้ isPaid = true
 *       2. สร้าง bill ใหม่
 *       3. ต่ออายุ license (+7 วัน)
 *
 *       ⚠️ Endpoint นี้เรียกโดย Stripe เท่านั้น
 *     tags:
 *       - Payment
 *
 *     parameters:
 *       - in: header
 *         name: stripe-signature
 *         required: true
 *         schema:
 *           type: string
 *         description: Stripe webhook signature
 *
 *     requestBody:
 *       required: true
 *       description: Raw Stripe event payload
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *
 *     responses:
 *       200:
 *         description: Webhook received successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 received:
 *                   type: boolean
 *                   example: true
 *
 *       400:
 *         description: Webhook Error หรือ Missing metadata
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *
 *       500:
 *         description: Internal Server Error
 */
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

/* =========================
   🔥 งานหนักแยกออกมา
========================= */
async function processCheckoutSession(
  session: Stripe.Checkout.Session
) {
  try {
    const billId = session.metadata?.billId;
    const license = session.metadata?.license;
    const email = session.metadata?.email;
    const commission = session.metadata?.commission;

    // 🔥 validate ก่อนใช้ DB
    if (!billId || !license) {
      console.error("Missing metadata");
      return;
    }

    const existing = await prisma.bill.findUnique({
      where: { id: Number(billId) },
    });

    // กัน webhook ซ้ำ
    if (existing?.isPaid) {
      console.log("⚠️ webhook duplicate → skip");
      return;
    }

    const createdAt = new Date();
    const updated = await prisma.bill.updateMany({
        where: {
          id: Number(billId),
          isPaid: false,
        },
        data: {
          isPaid: true,
        },
      });

      if (updated.count === 0) {
        console.log("⚠️ webhook duplicate → skip");
        return;
      }

      await prisma.$transaction([
        prisma.bill.create({
          data: {
            exirelicendate: addDays(createdAt, 7),
            email,
            commission: Number(commission),
            license: {
              connect: {
                licensekey: license,
              },
            },
          },
        }),
        prisma.licenseKey.update({
          where: { licensekey: license },
          data: {
            expire: false,
            expireDate: addDays(createdAt, 7),
          },
        }),
      ]);

  

    console.log("✅ PAYMENT SUCCESS & DB UPDATED");
  } catch (err) {
    console.error("Process payment error:", err);
  }
}

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return new Response("Missing signature", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // ⭐ ตอบ Stripe ทันที
  if (event.type === "checkout.session.completed") {
  // fire-and-forget
  void processCheckoutSession(
    event.data.object as Stripe.Checkout.Session
  );
  }

  return new Response("ok", { status: 200 });

}