import prisma from "@/lib/prisma"; 
import { NextResponse } from "next/server";
import { addDays } from "date-fns";
/**
 * @swagger
 * /api/bill:
 *   get:
 *     summary: ดึงรายการบิลทั้งหมด
 *     description: |
 *       คืนค่ารายการ bill ทั้งหมด โดย include:
 *       - license
 *       - license.tradeAccount
 *       - license.model
 *     tags:
 *       - Bill
 *     responses:
 *       200:
 *         description: ดึงข้อมูลสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2026-02-22T10:00:00.000Z"
 *                   license:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 10
 *                       licensekey:
 *                         type: string
 *                         example: ABCD-1234-EFGH
 *                       tradeAccount:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 5
 *                           accountNumber:
 *                             type: string
 *                             example: "12345678"
 *                       model:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 3
 *                           name:
 *                             type: string
 *                             example: "EA Gold Pro"
 *       500:
 *         description: Error fetching bill
 */
export async function GET() {
  try {
    const bill = await prisma.bill.findMany({
        include: {
            license: {
                include: {
                    tradeAccount: true, 
                    model: true    
                        }
                }
            },
      orderBy: {
        createdAt: "desc",
      },
    })

    return Response.json(bill)
  } catch (error) {
    console.error(error)
    return new Response("Error fetching bill", { status: 500 })
  }
}




/**
 * @swagger
 * /api/bill:
 *   post:
 *     summary: สร้าง Bill ใหม่
 *     description: |
 *       ใช้สำหรับสร้างข้อมูล Bill และเชื่อมกับ License โดยใช้ licensekey
 *       
 *       ระบบจะตั้งค่า exirelicendate อัตโนมัติเป็น 7 วันจากวันที่สร้าง
 *
 *     tags:
 *       - Bill
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - licensekey
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *
 *               commission:
 *                 type: number
 *                 example: 15.5
 *
 *               licensekey:
 *                 type: string
 *                 example: "390F-F52F-14FF-XXXX"
 *
 *     responses:
 *       200:
 *         description: สร้าง Bill สำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *
 *       400:
 *         description: ไม่พบ licensekey
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: licensekey is required
 *
 *       500:
 *         description: สร้าง Bill ไม่สำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Create bill failed
 */

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, commission, licensekey } = body;

    if (!licensekey) {
      return NextResponse.json(
        { message: "licensekey is required" },
        { status: 400 }
      );
    }

    const newBill = await prisma.bill.create({
      data: {
        exirelicendate: addDays(new Date(), 7),
        email,
        commission,
        license: {
          connect: {
            licensekey,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: newBill,
    });

  } catch (error) {
    console.error("POST BILL ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Create bill failed" },
      { status: 500 }
    );
  }
}

