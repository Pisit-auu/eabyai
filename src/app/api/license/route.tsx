import prisma from "@/lib/prisma"; 
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const licenseKey = await prisma.licenseKey.findMany({
      include: {
        tradeAccount: true,
        model: true,
        bill: true
    },
      orderBy: {
        createdAt: "desc",
      },
    })

    return Response.json(licenseKey)
  } catch (error) {
    console.error(error)
    return new Response("Error fetching tradeaccount", { status: 500 })
  }
}





export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. รับค่าตามที่ Payload ส่งมา (ใช้ชื่อ nameEA ให้ตรงกับ JSON)
    const { licensekey, expireDate, platformAccountId, nameEA } = body;

    // 2. ตรวจสอบว่ามีค่าครบไหม (ถ้าขาดตัวใดตัวหนึ่งจะส่ง 400)
    if (!licensekey || !expireDate || !platformAccountId || !nameEA) {
      return NextResponse.json({ error: "ข้อมูลไม่ครบถ้วน" }, { status: 400 });
    }

    // 3. บันทึก
    const result = await prisma.licenseKey.create({
      data: {
        licensekey: licensekey,
        expireDate: expireDate, 
        
        tradeAccount: {
          connect: { platformAccountId: platformAccountId }
        },
        model: { 
          connect: { nameEA: nameEA } 
        },
        bill: {
          create: {
            totalAmount: Number(0),
      
          }
        }

      }
    });

    return NextResponse.json(result);

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server Error", details: String(error) }, { status: 500 });
  }
}