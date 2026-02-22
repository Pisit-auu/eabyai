import prisma from "@/lib/prisma"; 
import { type NextRequest } from "next/server";
/**
 * @swagger
 * /api/platform/{id}:
 *   get:
 *     summary: ดึงข้อมูล Platform ตามชื่อ
 *     description: ค้นหา platform จาก nameplatform
 *     tags:
 *       - Platform
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ชื่อ platform
 *         example: MT5
 *
 *     responses:
 *       200:
 *         description: ดึงข้อมูลสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nameplatform:
 *                   type: string
 *
 *       404:
 *         description: Not Found
 *
 *       500:
 *         description: Internal Server Error
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> } // เปลี่ยน type เป็น Promise
) {
    try {
        // --- จุดสำคัญ: ต้อง await params ก่อนดึง id ออกมา ---
        const { id } = await params; 

        const platform = await prisma.platform.findUnique({
            where: { 
                // ถ้าใน Schema ของคุณ 'nameSymbol' เป็น unique key
                nameplatform: id 
            }
        });

        if (!platform) {
            return Response.json({ message: "Not Found" }, { status: 404 });
        }

        return Response.json(platform);
    } catch (error) {
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
/**
 * @swagger
 * /api/platform/{id}:
 *   put:
 *     summary: อัปเดต Platform
 *     description: อัปเดตชื่อ platform จาก nameplatform เดิม
 *     tags:
 *       - Platform
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: nameplatform เดิม
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nameplatform:
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
 *       400:
 *         description: PUT update failed
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        
        const updatedPlatform = await prisma.platform.update({
            where: { nameplatform: id },
            data: {
                // ในกรณี PUT มักจะอัปเดตทุก field ที่ส่งมา
                nameplatform: body.nameplatform,
                // fieldอื่น: body.fieldอื่น
            }
        });

        return Response.json(updatedPlatform);
    } catch (error) {
        return Response.json({ error: "PUT update failed" }, { status: 400 });
    }
}
/**
 * @swagger
 * /api/platform/{id}:
 *   delete:
 *     summary: ลบ Platform ตามชื่อ
 *     tags:
 *       - Platform
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: nameplatform ที่ต้องการลบ
 *
 *     responses:
 *       200:
 *         description: ลบสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: ลบ MT5 สำเร็จแล้ว
 *
 *       400:
 *         description: ลบไม่สำเร็จ หรือไม่มีข้อมูลนี้อยู่แล้ว
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params; // ต้อง await ตรงนี้เหมือนกัน

        await prisma.platform.delete({
            where: { nameplatform: id }
        });

        return Response.json({ message: `ลบ ${id} สำเร็จแล้ว` });
    } catch (error) {
        return Response.json({ error: "ลบไม่สำเร็จ หรือไม่มีข้อมูลนี้อยู่แล้ว" }, { status: 400 });
    }
}

