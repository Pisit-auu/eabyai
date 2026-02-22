import prisma from "@/lib/prisma"; 
import { NextResponse } from "next/server";
/**
 * @swagger
 * /api/tradeaccount:
 *   get:
 *     summary: ดึงรายการ Trade Account ทั้งหมด
 *     description: |
 *       ดึงข้อมูล tradeAccount ทั้งหมด
 *       พร้อม include:
 *       - user
 *       - platform
 *     tags:
 *       - TradeAccount
 *
 *     responses:
 *       200:
 *         description: ดึงข้อมูลสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *
 *       500:
 *         description: Error fetching tradeaccount
 */
export async function GET() {
  try {
    const tradeaccount = await prisma.tradeAccount.findMany({
      include: {
    user: true,
    platform: true,
    },
      orderBy: {
        createdAt: "desc",
      },
    })

    return Response.json(tradeaccount)
  } catch (error) {
    console.error(error)
    return new Response("Error fetching tradeaccount", { status: 500 })
  }
}


/**
 * @swagger
 * /api/tradeaccount:
 *   post:
 *     summary: สร้าง Trade Account ใหม่
 *     description: |
 *       เพิ่มบัญชีเทรดใหม่เข้าสู่ระบบ
 *       โดยผูกกับ user (email)
 *     tags:
 *       - TradeAccount
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - platformAccountId
 *               - PlatformName
 *               - user
 *             properties:
 *               platformAccountId:
 *                 type: string
 *                 example: "12345678"
 *                 description: เลขบัญชีเทรด
 *               InvestorPassword:
 *                 type: string
 *                 example: mypassword
 *                 description: Investor Password (optional)
 *               PlatformName:
 *                 type: string
 *                 example: MT5
 *                 description: ชื่อ platform
 *               user:
 *                 type: string
 *                 format: email
 *                 example: user@email.com
 *                 description: email ของ user
 *
 *     responses:
 *       200:
 *         description: สร้าง Trade Account สำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Missing required fields
 *
 *       500:
 *         description: Internal Server Error
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. รับค่า (Destructuring) ตามชื่อที่ Console log ออกมาเป๊ะๆ
    const { platformAccountId, PlatformName,InvestorPassword, user } = body;

    // 2. ตรวจสอบว่ามีค่าส่งมาครบไหม
    if (!platformAccountId || !PlatformName || !user) {
      return NextResponse.json(
        { error: "Missing required fields" }, 
        { status: 400 }
      );
    }

    // 3. บันทึกลง Database
    const newtrader = await prisma.tradeAccount.create({
      data: {
        // ใส่ค่าให้ตรงกับชื่อ Field ใน Schema (ซ้าย = ชื่อใน DB, ขวา = ค่าจาก Frontend)
        
        platformAccountId: platformAccountId,
        
        InvestorPassword : InvestorPassword,
        PlatformName: PlatformName, 
        
        email: user, 
        

      },
    });

    return NextResponse.json(newtrader);

  } catch (error) {
    console.error("Create Account Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: String(error) }, 
      { status: 500 }
    );
  }
}