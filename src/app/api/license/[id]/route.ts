import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { addDays } from "date-fns";

/**
 * @swagger
 * /api/license/{id}:
 *   get:
 *     summary: ดึงข้อมูล License ตาม email หรือ licensekey
 *     description: |
 *       ค้นหา license จาก:
 *       - email
 *       - licensekey
 *       พร้อม include tradeAccount, model และ bills
 *     tags:
 *       - License
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: email หรือ licensekey
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
 *       404:
 *         description: ไม่พบ License นี้
 *
 *       500:
 *         description: Server Error
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // id ในที่นี้คือ licensekey string

  try {
    const license = await prisma.licenseKey.findMany({
      where: {
        OR: [
          { email: id },
          { licensekey: id }
        ]
      },
      include: {
        tradeAccount: true, // ดึงข้อมูลพอร์ตที่ผูกอยู่
        model: true,        // ดึงข้อมูล EA ที่ผูกอยู่
         bills: true,
      },
    });

    if (!license) {
      return NextResponse.json({ error: "ไม่พบ License นี้" }, { status: 404 });
    }

    return NextResponse.json(license);
  } catch (error) {
    return NextResponse.json({ error: "Server Error", details: String(error) }, { status: 500 });
  }
}

/**
 * @swagger
 * /api/license/{id}:
 *   put:
 *     summary: อัปเดตข้อมูล License
 *     description: |
 *       อัปเดตข้อมูล license ตาม licensekey
 *       สามารถอัปเดตได้ เช่น:
 *       - expire
 *       - status
 *       - active
 *       - email
 *       - expireDate
 *       - tradeAccount (platformAccountId)
 *       - model (nameEA)
 *     tags:
 *       - License
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: licensekey
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               expire:
 *                 type: boolean
 *                 example: false
 *               status:
 *                 type: string
 *                 example: ACTIVE
 *               active:
 *                 type: boolean
 *                 example: true
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@email.com
 *               expireDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-03-01T00:00:00.000Z"
 *               platformAccountId:
 *                 type: string
 *                 example: "12345678"
 *               nameEA:
 *                 type: string
 *                 example: EA Gold Pro
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
 *         description: อัปเดตล้มเหลว
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const body = await request.json();

    const updatedLicense = await prisma.licenseKey.update({
      where: { licensekey: id },
      data: {
        ...(body.expire !== undefined && { expire: body.expire }),
        ...(body.status !== undefined && { status: body.status }),
        ...(body.active !== undefined && { active: body.active }),
        ...(body.email !== undefined && { email: body.email }),
        ...(body.expireDate &&
          !isNaN(new Date(body.expireDate).getTime()) &&
          (() => {
            const newExpireDate = new Date(body.expireDate);
            return {
              expireDate: newExpireDate,
              billOpenDate: addDays(newExpireDate, -2),
            };
          })()),

        ...(body.platformAccountId && {
          tradeAccount: {
            connect: { platformAccountId: body.platformAccountId },
          },
        }),

        ...(body.nameEA && {
          model: {
            connect: { nameEA: body.nameEA },
          },
        }),
      },
    });

    return NextResponse.json(updatedLicense);
  } catch (error) {
    console.error("Update License Error:", error);
    return NextResponse.json(
      { error: "อัปเดตล้มเหลว", details: String(error) },
      { status: 500 }
    );
  }
}


/**
 * @swagger
 * /api/license/{id}:
 *   delete:
 *     summary: ลบ License ตาม licensekey
 *     tags:
 *       - License
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: licensekey
 *
 *     responses:
 *       200:
 *         description: ลบ License สำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: ลบ License สำเร็จ
 *
 *       500:
 *         description: ไม่สามารถลบได้
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await prisma.licenseKey.delete({
      where: { licensekey: id },
    });

    return NextResponse.json({ message: "ลบ License สำเร็จ" });
  } catch (error) {
    console.error("Delete License Error:", error);
    return NextResponse.json({ error: "ไม่สามารถลบได้", details: String(error) }, { status: 500 });
  }
}