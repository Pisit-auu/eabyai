import prisma from "@/lib/prisma"
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {

  const { id } = await context.params; 

  try {
    // 1. เปลี่ยนเป็น findMany เพราะ User 1 คนอาจมีหลายพอร์ต
   const tradeaccounts = await prisma.tradeAccount.findMany({
      where: {
        OR: [
          { email: id },
          { platformAccountId: id }
        ]
      },
      include: {
        user: true,
        platform: true,
      },
    });


    // ถ้าไม่เจอสักรายการ (ส่ง Array ว่างกลับไป หรือจะ return 404 ก็ได้)
    if (!tradeaccounts || tradeaccounts.length === 0) {
      return new Response("No accounts found for this email", { status: 404 });
    }

    return Response.json(tradeaccounts);
  } catch (error) {
    console.error(error);
    return new Response("Error fetching data", { status: 500 });
  }
}



export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> } 
) {
  const { id } = await context.params;

  try {
    const body = await request.json();

    const updated = await prisma.tradeAccount.update({
      where: { platformAccountId: id }, 
      data: {
        ...(body.platformAccountId && { platformAccountId: body.platformAccountId }),
        ...(body.InvestorPassword && { InvestorPassword: body.InvestorPassword }),
        ...(body.Server && { Server: body.Server }),
        ...(body.Leverage && { Leverage: body.Leverage.toString() }),
        ...(body.fullname && { fullname: body.fullname }),
        ...(body.connect !== undefined && { connect: body.connect }),
        ...(body.user && { email: body.user }),
        ...(body.PlatformName && { PlatformName: body.PlatformName }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update Error:", error);
    return new NextResponse("Update failed", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  try {
    await prisma.tradeAccount.delete({
      where: { platformAccountId: id },
    })

    return new Response("Deleted successfully", { status: 200 })
  } catch (error) {
    console.error(error)
    return new Response("Delete failed", { status: 500 })
  }
}

