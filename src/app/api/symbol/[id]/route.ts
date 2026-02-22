import prisma from "@/lib/prisma"; 
import { type NextRequest } from "next/server";
/**
 * @swagger
 * /api/symbol/{id}:
 *   get:
 *     summary: ดึงข้อมูล Symbol ตามชื่อ
 *     description: ค้นหา symbol จาก nameSymbol
 *     tags:
 *       - Symbol
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ชื่อ symbol
 *         example: XAUUSD
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
 *                 nameSymbol:
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

        const symbol = await prisma.symbol.findUnique({
            where: { 
                // ถ้าใน Schema ของคุณ 'nameSymbol' เป็น unique key
                nameSymbol: id 
            }
        });

        if (!symbol) {
            return Response.json({ message: "Not Found" }, { status: 404 });
        }

        return Response.json(symbol);
    } catch (error) {
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
/**
 * @swagger
 * /api/symbol/{id}:
 *   put:
 *     summary: อัปเดต Symbol
 *     description: อัปเดตชื่อ symbol จาก nameSymbol เดิม
 *     tags:
 *       - Symbol
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: nameSymbol เดิม
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nameSymbol:
 *                 type: string
 *                 example: XAUUSD
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
        
        const updatedSymbol = await prisma.symbol.update({
            where: { nameSymbol: id },
            data: {
                // ในกรณี PUT มักจะอัปเดตทุก field ที่ส่งมา
                nameSymbol: body.nameSymbol,
                // fieldอื่น: body.fieldอื่น
            }
        });

        return Response.json(updatedSymbol);
    } catch (error) {
        return Response.json({ error: "PUT update failed" }, { status: 400 });
    }
}
/**
 * @swagger
 * /api/symbol/{id}:
 *   delete:
 *     summary: ลบ Symbol ตามชื่อ
 *     tags:
 *       - Symbol
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: nameSymbol ที่ต้องการลบ
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
 *                   example: ลบ XAUUSD สำเร็จแล้ว
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

        await prisma.symbol.delete({
            where: { nameSymbol: id }
        });

        return Response.json({ message: `ลบ ${id} สำเร็จแล้ว` });
    } catch (error) {
        return Response.json({ error: "ลบไม่สำเร็จ หรือไม่มีข้อมูลนี้อยู่แล้ว" }, { status: 400 });
    }
}

