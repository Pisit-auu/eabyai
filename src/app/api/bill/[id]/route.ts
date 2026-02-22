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
 *     summary: อัปเดต profit ของ bill ล่าสุดที่ยังไม่หมดอายุ
 *     description: |
 *       ค้นหา bill ล่าสุดจาก licensekey ที่ยังไม่หมดอายุ
 *       แล้วเพิ่มค่า profit ด้วย increment
 *     tags:
 *       - Bill
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: licensekey
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               profit:
 *                 type: number
 *                 example: 100
 *     responses:
 *       200:
 *         description: อัปเดตสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Missing profit
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
          gt: new Date(), 
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