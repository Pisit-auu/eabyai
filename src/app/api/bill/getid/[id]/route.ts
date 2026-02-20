import prisma from "@/lib/prisma"; 
import { NextResponse,NextRequest } from "next/server";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: licensekey } = await context.params;
    const body = await req.json();
    const { profit } = body;

    if (profit === undefined) {
      return NextResponse.json(
        { error: "Missing profit" },
        { status: 400 }
      );
    }

    const bill = await prisma.bill.findFirst({
      where: {
        licenseId: licensekey,
        exirelicendate: {
          gt: new Date(), // ยังไม่หมดอายุ
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!bill) {
      return NextResponse.json(
        { error: "ไม่พบบิล หรือหมดอายุแล้ว" },
        { status: 404 }
      );
    }

    // ⭐ update + profit
    const updatedBill = await prisma.bill.update({
      where: {
        id: bill.id,
      },
      data: {
        profit: {
          increment: Number(profit),
        },
      },
    });

    return NextResponse.json(updatedBill);

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Update failed" },
      { status: 500 }
    );
  }
}