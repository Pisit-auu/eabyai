import prisma from "@/lib/prisma"; 
import { NextResponse,NextRequest } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // id ในที่นี้คือ licensekey string

  try {
    const bill = await prisma.bill.findMany({
      where: { email: id },
        include: {
            license: {
            include: {
                model: true,
                tradeAccount : true
            },
            },
        }
    });
    

    if (!bill) {
      return NextResponse.json({ error: "ไม่พบ License นี้" }, { status: 404 });
    }

    return NextResponse.json(bill);
  } catch (error) {
    return NextResponse.json({ error: "Server Error", details: String(error) }, { status: 500 });
  }
}


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
          gt: new Date(), 
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