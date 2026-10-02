import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { addDays } from "date-fns";
/**
 * @swagger
 * /api/license/uplicense/{id}:
 *   put:
 *     summary: อัปเดตข้อมูล License
 *     description: |
 *       ใช้สำหรับอัปเดตข้อมูล License โดยระบุ license key ผ่าน path parameter
 *       
 *       สามารถอัปเดตได้เฉพาะ field ที่ส่งมาใน body:
 *       - expire
 *       - status
 *       - active
 *       - email
 *       - expireDate
 *       - platformAccountId (เชื่อม Trade Account)
 *       - nameEA (เชื่อม Model EA)
 *
 *     tags:
 *       - License
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: License Key
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
 *
 *               status:
 *                 type: string
 *                 example: ACTIVE
 *
 *               active:
 *                 type: boolean
 *                 example: true
 *
 *               email:
 *                 type: string
 *                 example: user@example.com
 *
 *               expireDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-03-01T11:12:23.304Z"
 *
 *               platformAccountId:
 *                 type: string
 *                 example: "12345678"
 *
 *               nameEA:
 *                 type: string
 *                 example: "EA_GOLD_V1"
 *
 *     responses:
 *       200:
 *         description: อัปเดต License สำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *
 *       500:
 *         description: อัปเดต License ไม่สำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Update license failed
 */
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const body = await request.json();

    const expireDate =
      body.expireDate &&
      !isNaN(new Date(body.expireDate).getTime())
        ? new Date(body.expireDate)
        : undefined;

    const updatedLicense = await prisma.licenseKey.update({
      where: {
        licensekey: id,
      },
      data: {
        ...(body.expire !== undefined
          ? { expire: body.expire }
          : {}),

        ...(body.status !== undefined
          ? { status: body.status }
          : {}),

        ...(body.active !== undefined
          ? { active: body.active }
          : {}),

        ...(body.email !== undefined
          ? { email: body.email }
          : {}),

        ...(expireDate
          ? { expireDate }
          : {}),

        ...(body.platformAccountId
          ? {
              tradeAccount: {
                connect: {
                  platformAccountId: body.platformAccountId,
                },
              },
            }
          : {}),

        ...(body.nameEA
          ? {
              model: {
                connect: {
                  nameEA: body.nameEA,
                },
              },
            }
          : {}),
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedLicense,
    });

  } catch (error) {
    console.error("Update License Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Update license failed",
      },
      { status: 500 }
    );
  }
}