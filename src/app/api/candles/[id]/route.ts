import { NextResponse } from "next/server";
/**
 * @swagger
 * /api/candles/{id}:
 *   get:
 *     summary: ดึงข้อมูลแท่งเทียน (candles) ตาม symbol
 *     description: |
 *       ดึงข้อมูล candles จาก Python service
 *       สามารถกำหนดจำนวนข้อมูล (count) และ timeframe ได้ผ่าน query string
 *     tags:
 *       - Candles
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: symbol เช่น XAUUSD, BTCUSD
 *
 *       - in: query
 *         name: count
 *         required: false
 *         schema:
 *           type: integer
 *           default: 100
 *         description: จำนวนแท่งเทียนที่ต้องการ
 *
 *       - in: query
 *         name: timeframe
 *         required: false
 *         schema:
 *           type: string
 *           example: H1
 *         description: timeframe เช่น M1, M5, M15, H1, H4, D1
 *
 *     responses:
 *       200:
 *         description: ดึงข้อมูล candles สำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   time:
 *                     type: string
 *                     example: "2026-02-22T10:00:00Z"
 *                   open:
 *                     type: number
 *                     example: 2020.5
 *                   high:
 *                     type: number
 *                     example: 2025.1
 *                   low:
 *                     type: number
 *                     example: 2018.2
 *                   close:
 *                     type: number
 *                     example: 2023.8
 *                   volume:
 *                     type: number
 *                     example: 1500
 *
 *       404:
 *         description: Data source error (ไม่พบข้อมูลจาก Python service)
 *
 *       500:
 *         description: Internal Server Error
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const symbol = id;

  const { searchParams } = new URL(request.url);
  const count = searchParams.get("count") || "100";
  // 👇 รับค่า timeframe (ถ้าไม่มีให้เป็น H1)
  const timeframe = searchParams.get("timeframe") || "H1"; 

  try {
    // 👇 ส่ง timeframe ไปที่ Python ด้วย
    const res = await fetch(`http://127.0.0.1:8000/get-candles/${symbol}?count=${count}&timeframe=${timeframe}`, {
      cache: 'no-store' 
    });
    if (!res.ok) {
      // ถ้า Python ตอบ 404 มา Next.js ก็จะตอบ 404 กลับไปที่หน้าเว็บ
      return NextResponse.json({ error: "Data source error" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);

  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}