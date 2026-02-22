import prisma from "@/lib/prisma"
import { NextResponse } from "next/server";
/**
 * @swagger
 * /api/tradeaccount/{id}:
 *   get:
 *     summary: ดึงข้อมูล Trade Account ตาม email หรือ account id
 *     description: |
 *       ค้นหา tradeAccount โดย:
 *       - email
 *       - platformAccountId
 *       (User 1 คนสามารถมีหลายพอร์ตได้)
 *     tags:
 *       - TradeAccount
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: email หรือ platformAccountId
 *         example: 12345678
 *
 *     responses:
 *       200:
 *         description: ดึงข้อมูลสำเร็จ (array)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *
 *       500:
 *         description: Error fetching data
 */
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {

  const { id } = await context.params; 

  try {
    // 1. เปลี่ยนเป็น findMany เพราะ User 1 คนอาจมีหลายพอร์ต
   const tradeaccounts = await prisma.tradeAccount.findMany({
      where: {
        OR: [
          { email: id },
          { platformAccountId: id }
        ]
      },
      include: {
        user: true,
        platform: true,
      },
    });


    // ถ้าไม่เจอสักรายการ (ส่ง Array ว่างกลับไป หรือจะ return 404 ก็ได้)
    if (!tradeaccounts || tradeaccounts.length === 0) {
      return NextResponse.json([]);
    }

    return Response.json(tradeaccounts);
  } catch (error) {
    console.error(error);
    return new Response("Error fetching data", { status: 500 });
  }
}


/**
 * @swagger
 * /api/tradeaccount/{id}:
 *   put:
 *     summary: อัปเดต Trade Account
 *     description: |
 *       อัปเดตข้อมูล tradeAccount โดยใช้ platformAccountId
 *       สามารถอัปเดตได้บาง field (partial update)
 *     tags:
 *       - TradeAccount
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: platformAccountId เดิม
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               platformAccountId:
 *                 type: string
 *                 example: "12345678"
 *               InvestorPassword:
 *                 type: string
 *                 example: mypassword
 *               Server:
 *                 type: string
 *                 example: Exness-MT5Real
 *               Leverage:
 *                 type: string
 *                 example: "500"
 *               fullname:
 *                 type: string
 *                 example: John Doe
 *               connect:
 *                 type: boolean
 *                 example: true
 *               user:
 *                 type: string
 *                 format: email
 *                 example: user@email.com
 *               PlatformName:
 *                 type: string
 *                 example: MT5
 *
 *     responses:
 *       200:
 *         description: อัปเดตสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *
 *       500:
 *         description: Update failed
 */
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> } 
) {
  const { id } = await context.params;

  try {
    const body = await request.json();

    const updated = await prisma.tradeAccount.update({
      where: { platformAccountId: id }, 
      data: {
        ...(body.platformAccountId && { platformAccountId: body.platformAccountId }),
        ...(body.InvestorPassword && { InvestorPassword: body.InvestorPassword }),
        ...(body.Server && { Server: body.Server }),
        ...(body.Leverage && { Leverage: body.Leverage.toString() }),
        ...(body.fullname && { fullname: body.fullname }),
        ...(body.connect !== undefined && { connect: body.connect }),
        ...(body.user && { email: body.user }),
        ...(body.PlatformName && { PlatformName: body.PlatformName }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update Error:", error);
    return new NextResponse("Update failed", { status: 500 });
  }
}
/**
 * @swagger
 * /api/tradeaccount/{id}:
 *   delete:
 *     summary: ลบ Trade Account
 *     tags:
 *       - TradeAccount
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: platformAccountId ที่ต้องการลบ
 *
 *     responses:
 *       200:
 *         description: Deleted successfully
 *
 *       500:
 *         description: Delete failed
 */
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  try {
    await prisma.tradeAccount.delete({
      where: { platformAccountId: id },
    })

    return new Response("Deleted successfully", { status: 200 })
  } catch (error) {
    console.error(error)
    return new Response("Delete failed", { status: 500 })
  }
}

