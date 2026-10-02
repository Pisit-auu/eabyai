import prisma from "@/lib/prisma"; 
import { NextResponse } from "next/server";
import { addDays } from "date-fns";
/**
 * @swagger
 * /api/license:
 *   get:
 *     summary: ดึงรายการ License ทั้งหมด
 *     description: |
 *       คืนค่ารายการ license ทั้งหมด
 *       พร้อมข้อมูล tradeAccount และ model
 *     tags:
 *       - License
 *     responses:
 *       200:
 *         description: ดึงข้อมูลสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Error fetching tradeaccount
 */
export async function GET() {
  try {
    const licenseKey = await prisma.licenseKey.findMany({
      include: {
        tradeAccount: true,
        model: true,
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



/**
 * @swagger
 * /api/license:
 *   post:
 *     summary: สร้าง License ใหม่
 *     description: |
 *       สร้าง license ใหม่ พร้อม:
 *       - ผูกกับ tradeAccount
 *       - ผูกกับ model (EA)
 *       - สร้าง bill เริ่มต้นอัตโนมัติ
 *       โดย expireDate จะถูกตั้งเป็น +7 วัน
 *     tags:
 *       - License
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - licensekey
 *               - platformAccountId
 *               - nameEA
 *               - commission
 *             properties:
 *               licensekey:
 *                 type: string
 *                 example: ABCD-1234-EFGH
 *               platformAccountId:
 *                 type: string
 *                 example: "12345678"
 *               nameEA:
 *                 type: string
 *                 example: EA Gold Pro
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@email.com
 *               commission:
 *                 type: number
 *                 example: 10
 *
 *     responses:
 *       200:
 *         description: สร้าง License สำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 licensekey:
 *                   type: string
 *                 expireDate:
 *                   type: string
 *                   format: date-time
 *                 bills:
 *                   type: array
 *                   items:
 *                     type: object
 *
 *       400:
 *         description: ข้อมูลไม่ครบถ้วน
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: ข้อมูลไม่ครบถ้วน
 *
 *       500:
 *         description: Server Error
 */

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { licensekey, platformAccountId, nameEA ,email,commission} = body;
    console.log("awdawda")
    console.log(commission)
    if (!licensekey || !platformAccountId || !nameEA || !commission) {
      return NextResponse.json(
        { error: "ข้อมูลไม่ครบถ้วน" },
        { status: 400 }
      );
    }

    const createdAt = new Date();

    const result = await prisma.licenseKey.create({
      data: {
        licensekey,
        expireDate: addDays(createdAt, 7),
        email,
        tradeAccount: {
          connect: { platformAccountId }
        },
       
        model: {
          connect: { nameEA }
        },
        
        bills: {
          create: {
            profit: 0,
            commission: Number(commission ?? 0),
            exirelicendate: addDays(createdAt, 7),
            email:email,
            isPaid: false
          }
        }
      },

      include: {
        bills: true
      }
    });

    return NextResponse.json(result);

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Server Error", details: String(error) },
      { status: 500 }
    );
  }
}