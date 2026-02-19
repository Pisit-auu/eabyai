import prisma from "@/lib/prisma"; 
import { type NextRequest } from "next/server";

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

