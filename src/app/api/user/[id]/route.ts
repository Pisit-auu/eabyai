import { NextRequest,NextResponse } from "next/server";
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
  req: NextRequest,
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
 * put:
 * summary: อัปเดตข้อมูล User และสถานะ Setup Guide (Step 1)
 * description: |
 * อัปเดตข้อมูลโปรไฟล์ user โดยใช้ email เป็น id
 * เมื่อมีการอัปเดตสำเร็จ ระบบจะทำการติ๊กถูกใน Setup Guide ขั้นตอนที่ 1 (จัดการข้อมูล User) ให้โดยอัตโนมัติ
 * tags:
 * - User
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * description: email ของ user
 * example: user@email.com
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * name:
 * type: string
 * example: John Doe
 * image:
 * type: string
 * example: https://example.com/profile.jpg
 * role:
 * type: string
 * example: user
 * responses:
 * 200:
 * description: อัปเดตโปรไฟล์และสถานะ Setup Guide สำเร็จ
 * 400:
 * description: ไม่พบข้อมูล Email หรือข้อมูลไม่ถูกต้อง
 * 500:
 * description: เกิดข้อผิดพลาดที่ Server
 */
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // คือ email
    const body = await req.json();
    
    // รับค่า stepId จาก body ที่ส่งมาจาก Axios
    const { name, image, role, stepId } = body; 

    if (!id) {
      return NextResponse.json({ error: "ไม่พบข้อมูล Email" }, { status: 400 });
    }

    // 1. ดึงข้อมูล User เดิม
    const currentUser = await prisma.user.findUnique({
      where: { email: id },
      select: { setupProgress: true }
    });

    if (!currentUser) {
      return NextResponse.json({ error: "ไม่พบผู้ใช้งาน" }, { status: 404 });
    }

    // ทำสำเนา Array เดิม
    let newProgress = [...(currentUser.setupProgress || [])];

    // 2. Logic การจัดการ SetupProgress
    if (stepId) {
      // --- กันการข้าม Step ---
      if (stepId > 1) {
        const previousStep = stepId - 1;
        if (!newProgress.includes(previousStep)) {
          return NextResponse.json(
            { error: `กรุณาทำขั้นตอนที่ ${previousStep} ให้เสร็จก่อน` },
            { status: 400 }
          );
        }
      }

      // เพิ่ม stepId ที่ส่งมา (ถ้ายังไม่มี)
      if (!newProgress.includes(Number(stepId))) {
        newProgress.push(Number(stepId));
      }
    } else {
      // กรณีหน้า User (ถ้าส่งแค่ name/image มาเฉยๆ ให้ถือว่าเป็น Step 1)
      if (!newProgress.includes(1)) {
        newProgress.push(1);
      }
    }

    // 3. อัปเดตข้อมูลลง Database
    const updatedUser = await prisma.user.update({
      where: { email: id },
      data: {
        // อัปเดตเฉพาะฟิลด์ที่มีการส่งมาจริง (ป้องกันค่า null ทับค่าเดิม)
        ...(name !== undefined && { name }),
        ...(image !== undefined && { image }),
        ...(role !== undefined && { role }),
        setupProgress: newProgress,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


/**
 * @swagger
 * /api/user/{id}:
 *   delete:
 *     summary: Delete user by email
 *     description: ลบ user ออกจากระบบโดยใช้ email เป็น id
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User email
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  await prisma.user.delete({
    where: { email: id },
  });
}