import prisma from "@/lib/prisma"; 
import { type NextRequest } from "next/server";

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

