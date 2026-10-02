import prisma from "@/lib/prisma"; 
import { type NextRequest } from "next/server";
/**
 * @swagger
 * /api/timeframe/{id}:
 *   get:
 *     summary: ดึงข้อมูล Timeframe ตามชื่อ
 *     description: ค้นหา timeframe จาก nametimeframe
 *     tags:
 *       - Timeframe
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ชื่อ timeframe
 *         example: H1
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
 *                 nametimeframe:
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
    { params }: { params: Promise<{ id: string }> } 
) {
    try {
        const { id } = await params; 

        const timeframe = await prisma.timeframe.findUnique({
            where: { 
                nametimeframe: id 
            }
        });

        if (!timeframe) {
            return Response.json({ message: "Not Found" }, { status: 404 });
        }

        return Response.json(timeframe);
    } catch (error) {
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
/**
 * @swagger
 * /api/timeframe/{id}:
 *   put:
 *     summary: อัปเดต Timeframe
 *     description: อัปเดตชื่อ timeframe จาก nametimeframe เดิม
 *     tags:
 *       - Timeframe
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: nametimeframe เดิม
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nametimeframe:
 *                 type: string
 *                 example: H4
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
        
        const updatedtimeframe = await prisma.timeframe.update({
            where: { nametimeframe: id },
            data: {
                // ในกรณี PUT มักจะอัปเดตทุก field ที่ส่งมา
                nametimeframe: body.nametimeframe,
                // fieldอื่น: body.fieldอื่น
            }
        });

        return Response.json(updatedtimeframe);
    } catch (error) {
        return Response.json({ error: "PUT update failed" }, { status: 400 });
    }
}
/**
 * @swagger
 * /api/timeframe/{id}:
 *   delete:
 *     summary: ลบ Timeframe ตามชื่อ
 *     tags:
 *       - Timeframe
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: nametimeframe ที่ต้องการลบ
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
 *                   example: ลบ H1 สำเร็จแล้ว
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

        await prisma.timeframe.delete({
            where: { nametimeframe: id }
        });

        return Response.json({ message: `ลบ ${id} สำเร็จแล้ว` });
    } catch (error) {
        return Response.json({ error: "ลบไม่สำเร็จ หรือไม่มีข้อมูลนี้อยู่แล้ว" }, { status: 400 });
    }
}

