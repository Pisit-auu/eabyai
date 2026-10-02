import prisma from "@/lib/prisma"; 
import { NextResponse,NextRequest } from "next/server";
/**
 * @swagger
 * /api/bill/{id}:
 *   get:
 *     summary: ดึงรายการบิลตาม email หรือ id
 *     description: คืนค่ารายการ bill ตาม id ที่ส่งมา พร้อมข้อมูล license, model และ tradeAccount
 *     tags:
 *       - Bill
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: email หรือ identifier ของ bill
 *     responses:
 *       200:
 *         description: ดึงข้อมูลสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       404:
 *         description: ไม่พบ License นี้
 *       500:
 *         description: Server Error
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // id ในที่นี้คือ licensekey string

  try {
    const bill = await prisma.bill.findMany({
      where: { email: id },
        include: {
            license: {
            include: {
                model: true,
                tradeAccount : true
            },
            },
        }
    });
    

    if (!bill) {
      return NextResponse.json({ error: "ไม่พบ License นี้" }, { status: 404 });
    }

    return NextResponse.json(bill);
  } catch (error) {
    return NextResponse.json({ error: "Server Error", details: String(error) }, { status: 500 });
  }
}
/**
 * @swagger
 * /api/bill/{id}:
 *   put:
 *     summary: อัปเดตสถานะการชำระเงินของ Bill
 *     description: |
 *       ใช้สำหรับอัปเดตค่า isPaid ของ Bill ตาม id
 *
 *     tags:
 *       - Bill
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID ของ Bill
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isPaid
 *             properties:
 *               isPaid:
 *                 type: boolean
 *                 example: true
 *
 *     responses:
 *       200:
 *         description: อัปเดต Bill สำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *
 *       500:
 *         description: อัปเดตไม่สำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Update failed
 */
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const body = await req.json();

    // ⭐ ต้อง await params
    const { id } = await context.params;

    const updatedBill = await prisma.bill.update({
      where: {
        id: Number.parseInt(id, 10),
      },
      data: {
        isPaid: body.isPaid,
      },
    });

    return NextResponse.json(updatedBill);

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Update failed" },
      { status: 500 }
    );
  }
}
/**
 * @swagger
 * /api/bill/{id}:
 *   delete:
 *     summary: ลบบิลตาม id
 *     tags:
 *       - Bill
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: bill id
 *     responses:
 *       200:
 *         description: ลบ Bill สำเร็จ
 *       500:
 *         description: ไม่สามารถลบได้
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await prisma.bill.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "ลบ Bill สำเร็จ" });
  } catch (error) {
    console.error("Delete Bill Error:", error);
    return NextResponse.json({ error: "ไม่สามารถลบได้", details: String(error) }, { status: 500 });
  }
}