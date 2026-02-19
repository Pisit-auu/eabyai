import prisma from "@/lib/prisma"; 
import { type NextRequest } from "next/server";

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

