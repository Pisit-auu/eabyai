// /api/account/details/route.ts
import { NextResponse } from "next/server";
import axios from "axios";
/**
 * @swagger
 * /api/account/details:
 *   post:
 *     summary: ดึงรายละเอียดบัญชีเทรดจากเซิร์ฟเวอร์ Python
 *     description: รับข้อมูลจาก Client แล้วส่งต่อไปยัง Python API
 *     tags:
 *       - Trade Account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               accountId:
 *                 type: string
 *                 description: รหัสบัญชีที่ต้องการดึงข้อมูล
 *                 example: "12345678"
 *               investorPassword:
 *                 type: string
 *                 description: รหัสผ่านของบัญชี
 *                 example: "12345678aA!"
 *               server:
 *                 type: string
 *                 description: ชื่อเซิร์ฟเวอร์
 *                 example: "Broker-Demo-Server"
 *               symbol:
 *                 type: string
 *                 description: ชื่อสกุลเงิน
 *                 example: "XAUUSD"
 *     responses:
 *       200:
 *         description: ดึงข้อมูลสำเร็จ
 *       500:
 *         description: เกิดข้อผิดพลาด
 */

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // console.log("Sending to Python:", body); 

    const res = await axios.post("http://127.0.0.1:8000/get-account-details", body);
    
    return NextResponse.json(res.data);
  
  } catch (error: any) {
    console.error("Python Error:", error.response?.data || error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}