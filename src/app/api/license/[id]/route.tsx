import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";


export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // id ในที่นี้คือ licensekey string

  try {
    const license = await prisma.licenseKey.findUnique({
      where: { licensekey: id },
      include: {
        tradeAccount: true, // ดึงข้อมูลพอร์ตที่ผูกอยู่
        model: true,        // ดึงข้อมูล EA ที่ผูกอยู่
        bill : true
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


export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await request.json();

    const updatedLicense = await prisma.licenseKey.update({
      where: { licensekey: id },
      data: {
        // อัปเดตเฉพาะค่าที่ส่งมา (ใช้ Direct Field Mapping)
        ...(body.valid !== undefined && { valid: body.valid }),
        ...(body.status !== undefined && { status: body.status }),
        ...(body.active !== undefined && { active: body.active }),
        ...(body.expireDate && { expireDate: new Date(body.expireDate) }),
        ...(body.platformAccountId && { platformAccountId: body.platformAccountId }),
        ...(body.nameEA && { nameEA: body.nameEA }),
      },
    });

    return NextResponse.json(updatedLicense);
  } catch (error) {
    console.error("Update License Error:", error);
    return NextResponse.json({ error: "อัปเดตล้มเหลว", details: String(error) }, { status: 500 });
  }
}


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