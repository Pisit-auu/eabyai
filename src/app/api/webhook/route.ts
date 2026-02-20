import Stripe from "stripe";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; 
import { addDays } from "date-fns";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  // ป้องกันกรณีที่ไม่มี Signature ส่งมา
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
    console.log(`Webhook Received: ${event.type}`);

    // ดักจับตอนจ่ายเงินสำเร็จ
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const billId = session.metadata?.billId;
      const license = session.metadata?.license;
      const email = session.metadata?.email;
      const commission = session.metadata?.commission;
        const existing = await prisma.bill.findUnique({
          where: { id : Number(billId)},
        });

      if (existing?.isPaid) {
        console.log("⚠️ webhook ซ้ำ → skip");
        return NextResponse.json({ received: true });
      }
      if (!billId || !license) {
        console.error("Missing metadata");
        return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
      }

      const createdAt = new Date();

      // 1. อัปเดตสถานะบิลเดิม
      await prisma.bill.update({
        where: { id: parseInt(billId) },
        data: { isPaid: true },
      });

      // 2. สร้างบิลใหม่ (ตรวจสอบดูอีกทีว่าตั้งใจสร้างใหม่ใช่ไหม)
      await prisma.bill.create({
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
      });

      // 3. อัปเดตวันหมดอายุของ License Key
      await prisma.licenseKey.update({
        where: { licensekey: license },
        data: {
          expire: false,
          expireDate: addDays(createdAt, 7),
        },
      });
      
      console.log("PAYMENT SUCCESS & DB UPDATED");
    }

    // 👉 ข้อสำคัญ: ต้องส่ง Response 200 กลับไปบอก Stripe เสมอ เพื่อหยุดการ Retry
    return NextResponse.json({ received: true }, { status: 200 });

  } catch (err: any) {
    console.error("Webhook Error:", err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }
}