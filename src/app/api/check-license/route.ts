import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"
import axios from "axios";
/**
 * @swagger
 * /api/check-license:
 *   post:
 *     summary: ตรวจสอบความถูกต้องของ License (สำหรับ MT5 / EA)
 *     description: |
 *       API นี้ใช้สำหรับให้ EA หรือ MT5 ยิงเข้ามาเพื่อตรวจสอบว่า
 *       License สามารถใช้งานได้หรือไม่ โดยตรวจสอบ:
 *       - มี license ในระบบหรือไม่
 *       - active / banned
 *       - expire date
 *       - account id
 *       - symbol
 *       - timeframe
 *       - platform
 *       และจะทำการตรวจสอบ MT5 account เพิ่มเติมผ่าน API ภายนอก
 *     tags:
 *       - Check License
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - licenseKey
 *               - accountId
 *               - symbol
 *               - timeframe
 *               - platform
 *               - server
 *             properties:
 *               licenseKey:
 *                 type: string
 *                 example: ABCD-1234-EFGH
 *               accountId:
 *                 type: string
 *                 example: "12345678"
 *               symbol:
 *                 type: string
 *                 example: XAUUSD
 *               timeframe:
 *                 type: string
 *                 example: H1
 *               platform:
 *                 type: string
 *                 example: MT5
 *               server:
 *                 type: string
 *                 example: Exness-MT5Real
 *
 *     responses:
 *       200:
 *         description: ตรวจสอบ License เสร็จสิ้น
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: PASS
 *                 message:
 *                   type: string
 *                   example: License Valid
 *                 expireDate:
 *                   type: string
 *                   format: date-time
 *
 *       400:
 *         description: Request ไม่ถูกต้อง
 *
 *       500:
 *         description: Internal Server Error
 */
export async function POST(req: Request) {
  try {
    // 1. รับค่าที่ MT5 ยิงมา
    // (EA ส่งมาเป็น JSON: licenseKey, accountId, symbol, timeframe, platform)
    const body = await req.json();
    const { licenseKey, accountId, symbol, timeframe, platform ,server } = body;

    console.log("📥 Check Request:", { licenseKey, accountId, symbol, timeframe,server });

    // 2. ค้นหา License ใน Database
    const license = await prisma.licenseKey.findUnique({
      where: { licensekey: licenseKey },
      include: { 
        tradeAccount: true,
        model: true 
      }
    });

    // --- ⛔ ด่านที่ 1: มี License นี้ในระบบไหม? ---
    if (!license) {
      return NextResponse.json({ status: "FAIL", message: "License key not found" });
    }

    // --- ⛔ ด่านที่ 2: License โดนสั่งปิด (Banned) หรือไม่? ---
    if (!license.active) {
      return NextResponse.json({ status: "FAIL", message: "License is Inactive/Banned" });
    }

    // --- ⛔ ด่านที่ 3: หมดอายุหรือยัง? ---
    // เช็คว่ามีวันหมดอายุไหม และ วันปัจจุบันเลยกำหนดหรือยัง
    if (license.expireDate && new Date() > new Date(license.expireDate)) {
      return NextResponse.json({ status: "FAIL", message: "License Expired" });
    }

    // --- ⛔ ด่านที่ 4: เลขพอร์ตตรงกันไหม? (สำคัญมาก) ---
    // แปลงเป็น String ทั้งคู่เพื่อความชัวร์เวลาเทียบ
    if (String(license.platformAccountId) !== String(accountId)) {
      return NextResponse.json({ 
        status: "FAIL", 
        message: `Wrong Account ID. This key is for ${license.platformAccountId}` 
      });
    }

    // --- ⛔ ด่านที่ 5: คู่เงินตรงกันไหม? (1 License = 1 คู่เงิน) ---
    // ถ้าใน DB เป็น "ALL" ให้ผ่าน, ถ้าไม่ใช่ ต้องตรงกันเป๊ะๆ (เช่น XAUUSD == XAUUSD)
    if (license.model.nameSymbol !== "ALL" && license.model.nameSymbol !== symbol) {
      return NextResponse.json({ 
        status: "FAIL", 
        message: `Invalid Symbol. This key is for ${license.model.nameSymbol} only.` 
      });
    }

    // --- ⛔ ด่านที่ 6: Timeframe ตรงกันไหม? ---
    if (license.model.timeframeName !== "ALL" && license.model.timeframeName !== timeframe) {
      return NextResponse.json({ 
        status: "FAIL", 
        message: `Invalid Timeframe. This key is for ${license.model.timeframeName} only.` 
      });
    }

    // --- ⛔ ด่านที่ 7: Platform ตรงกันไหม? ---
    if (license.model.PlatformName !== "ALL" && license.model.PlatformName !== platform) {
       return NextResponse.json({
         status: "FAIL",
         message: `Invalid Platform. This key is for ${license.model.PlatformName} only.`
       });
    }

    try {
        console.log("📤 Sending to CheckMT5:", {
        id: license.platformAccountId,
        pass: license.tradeAccount?.InvestorPassword,
        server: server
        });
      const response = await fetch("http://localhost:3000/api/checkmt5", {
        method: "POST",
        body: JSON.stringify({
          platformAccountId: license.platformAccountId, 
          InvestorPassword: license.tradeAccount.InvestorPassword,
          server: server,
        }),
      });
      
      const result = await response.json();
    //   console.log("Result:", result);
      
      if (result.status === "success") {
        console.log(`สำเร็จ! ยินดีต้อนรับคุณ ${result.name} ยอดคงเหลือ: ${result.balance} ${result}`);
           await axios.put(
                `http://localhost:3000/api/tradeaccount/${license.platformAccountId}`,
                {
                    Server: server,
                    connect: "true",
                    fullname: result.name,
                    Leverage: result.leverage
                }
)
            console.log("✅ License Verified for:", accountId);
      } else {
        console.log("ล้มเหลว: " + result.message);
        
      }
    } catch (error) {
      console.error("Error:", error);
    } 


    
    return NextResponse.json({ 
      status: "PASS", 
      message: "License Valid",
      expireDate: license.expireDate 
    });

  } catch (error) {
    console.error("🔥 Server Error:", error);
    return NextResponse.json(
      { status: "ERROR", message: "Internal Server Error" }, 
      { status: 500 }
    );
  }
}