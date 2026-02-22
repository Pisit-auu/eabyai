import prisma from "@/lib/prisma"; 
import { NextResponse,NextRequest } from "next/server";
/**
 * @swagger
 * /api/bill/getid/{id}:
 *   put:
 *     summary: เพิ่มค่า profit ให้ bill ล่าสุดที่ยังไม่หมดอายุโดยใช้ licensekey
 *     description: |
 *       ค้นหา bill ล่าสุดจาก licensekey ที่ยังไม่หมดอายุ 
 *       แล้วทำการเพิ่มค่า profit ด้วย increment
 *     tags:
 *       - Bill
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: licensekey ของ license
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - profit
 *             properties:
 *               profit:
 *                 type: number
 *                 example: 100
 *                 description: จำนวน profit ที่ต้องการเพิ่ม
 *     responses:
 *       200:
 *         description: อัปเดต profit สำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 profit:
 *                   type: number
 *                   example: 500
 *       400:
 *         description: Missing profit
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Missing profit
 *       404:
 *         description: ไม่พบบิล หรือหมดอายุแล้ว
 *       500:
 *         description: Update failed
 */
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: licensekey } = await context.params;
    const body = await req.json();
    const { profit } = body;

    if (profit === undefined) {
      return NextResponse.json(
        { error: "Missing profit" },
        { status: 400 }
      );
    }

    const bill = await prisma.bill.findFirst({
      where: {
        licenseId: licensekey,
        exirelicendate: {
          gt: new Date(), // ยังไม่หมดอายุ
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!bill) {
      return NextResponse.json(
        { error: "ไม่พบบิล หรือหมดอายุแล้ว" },
        { status: 404 }
      );
    }

    // ⭐ update + profit
    const updatedBill = await prisma.bill.update({
      where: {
        id: bill.id,
      },
      data: {
        profit: {
          increment: Number(profit),
        },
      },
    });

    return NextResponse.json(updatedBill);

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Update failed" },
      { status: 500 }
    );
  }
}