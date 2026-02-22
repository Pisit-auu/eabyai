import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
/**
 * @swagger
 * /api/user/{id}:
 *   get:
 *     summary: ดึงข้อมูล User ตาม email
 *     description: |
 *       ดึงข้อมูล user พร้อม relation:
 *       - tradeAccounts
 *       - licenses
 *       - bills
 *     tags:
 *       - User
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: email ของ user
 *         example: user@email.com
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
 *         description: Server Error
 */
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const user = await prisma.user.findMany({
    where: { email: id },
    include: {
      tradeAccounts: {
        include: {
          licenses: {
            include: {
              bills: true,
            },
          },
        },
      },
    },
  });

  return NextResponse.json(user);
}
/**
 * @swagger
 * /api/user/{id}:
 *   put:
 *     summary: อัปเดตข้อมูล User
 *     description: |
 *       อัปเดตข้อมูล user โดยใช้ email เป็น id
 *       สามารถอัปเดต:
 *       - name
 *       - image
 *     tags:
 *       - User
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: email ของ user
 *         example: user@email.com
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               image:
 *                 type: string
 *                 example: https://example.com/profile.jpg
 *
 *     responses:
 *       200:
 *         description: อัปเดตสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *
 *       400:
 *         description: ไม่พบข้อมูล Email (ID)
 *
 *       500:
 *         description: เกิดข้อผิดพลาดในการอัปเดตข้อมูล
 */
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // 1. รับค่า id (ในที่นี้คือ email) จาก params
    const { id } = await context.params;

    // 2. รับข้อมูลที่ส่งมาจากฝั่ง Client (เช่น name, image)
    const body = await req.json();
    const { name, image } = body;

    // 3. ตรวจสอบว่ามี id หรือไม่
    if (!id) {
      return NextResponse.json(
        { error: "ไม่พบข้อมูล Email (ID) ที่ต้องการแก้ไข" },
        { status: 400 }
      );
    }

    // 4. อัปเดตข้อมูล User ในฐานข้อมูล
    const updatedUser = await prisma.user.update({
      where: { 
        email: id 
      },
      data: {
        name: name,
        image: image,
      },
    });

    // 5. ส่งข้อมูลที่อัปเดตแล้วกลับไปให้ Client
    return NextResponse.json(updatedUser, { status: 200 });

  } catch (error) {
    console.error("PUT User Error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล" },
      { status: 500 }
    );
  }
}