import prisma from "@/lib/prisma"; 
import { type NextRequest } from "next/server";
/**
 * @swagger
 * /api/linkmodel/{id}:
 *   get:
 *     summary: ดึงข้อมูล LinkModel ตาม namefile
 *     description: ค้นหา linkModel โดยใช้ namefile เป็น id
 *     tags:
 *       - LinkModel
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: namefile ของ model
 *         example: model_v1.pt
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
 *                 namefile:
 *                   type: string
 *                 Pathname:
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

        const linkModel = await prisma.linkModel.findUnique({
            where: { 
                namefile: id 
            }
        });

        if (!linkModel) {
            return Response.json({ message: "Not Found" }, { status: 404 });
        }

        return Response.json(linkModel);
    } catch (error) {
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
/**
 * @swagger
 * /api/linkmodel/{id}:
 *   put:
 *     summary: อัปเดตข้อมูล LinkModel
 *     description: อัปเดตข้อมูล linkModel จาก namefile
 *     tags:
 *       - LinkModel
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: namefile เดิม
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               namefile:
 *                 type: string
 *                 example: model_v2.pt
 *               Pathname:
 *                 type: string
 *                 example: /models/model_v2.pt
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
        
        const updatedlinkModel = await prisma.linkModel.update({
            where: { namefile: id },
            data: {
                // ในกรณี PUT มักจะอัปเดตทุก field ที่ส่งมา
                namefile: body.namefile,
                Pathname: body.Pathname
                // fieldอื่น: body.fieldอื่น
            }
        });

        return Response.json(updatedlinkModel);
    } catch (error) {
        return Response.json({ error: "PUT update failed" }, { status: 400 });
    }
}
/**
 * @swagger
 * /api/linkmodel/{id}:
 *   delete:
 *     summary: ลบ LinkModel ตาม namefile
 *     tags:
 *       - LinkModel
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: namefile ที่ต้องการลบ
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
 *                   example: ลบ model_v1.pt สำเร็จแล้ว
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

        await prisma.linkModel.delete({
            where: { namefile: id }
        });

        return Response.json({ message: `ลบ ${id} สำเร็จแล้ว` });
    } catch (error) {
        return Response.json({ error: "ลบไม่สำเร็จ หรือไม่มีข้อมูลนี้อยู่แล้ว" }, { status: 400 });
    }
}

