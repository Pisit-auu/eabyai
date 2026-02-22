// /app/api/validate-mt5/route.ts (Example path)
import { NextResponse } from "next/server";
/**
 * @swagger
 * /api/validate-mt5:
 *   post:
 *     summary: ตรวจสอบบัญชี MT5 ผ่าน Python service
 *     description: |
 *       API นี้ใช้สำหรับตรวจสอบว่า MT5 account สามารถ login ได้หรือไม่
 *       โดยจะส่งข้อมูลไปยัง Python FastAPI (/check-account)
 *     tags:
 *       - MT5
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - platformAccountId
 *               - InvestorPassword
 *               - server
 *             properties:
 *               platformAccountId:
 *                 type: string
 *                 example: "12345678"
 *                 description: เลขบัญชี MT5
 *               InvestorPassword:
 *                 type: string
 *                 example: "mypassword"
 *                 description: Investor password ของ MT5
 *               server:
 *                 type: string
 *                 example: Exness-MT5Real
 *                 description: ชื่อ server MT5
 *
 *     responses:
 *       200:
 *         description: ตรวจสอบบัญชีสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 name:
 *                   type: string
 *                   example: John Doe
 *                 balance:
 *                   type: number
 *                   example: 1000.5
 *                 leverage:
 *                   type: integer
 *                   example: 500
 *
 *       400:
 *         description: Missing credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Missing credentials
 *
 *       500:
 *         description: Python Server Unreachable
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Python Server Unreachable
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { platformAccountId, InvestorPassword, server } = body; // รับ server มาจาก body

    // 1. Validation
    if (!platformAccountId || !InvestorPassword || !server ) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }

    // 2. Call Python FastAPI (Assuming it runs on port 8000)
    // IMPORTANT: Use the full URL and match the keys Python expects
    

    const res = await fetch("http://127.0.0.1:8000/check-account", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accountId: platformAccountId,
        investorPassword: InvestorPassword,
        server: server,
      }),
    });

    const data = await res.json();
    
    if (!res.ok) {
        return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data);

  } catch (error: any) {
    return NextResponse.json(
      { error: "Python Server Unreachable", details: error.message },
      { status: 500 }
    );
  }
}