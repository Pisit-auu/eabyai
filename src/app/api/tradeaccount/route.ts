import prisma from "@/lib/prisma"; 
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const tradeaccount = await prisma.tradeAccount.findMany({
      include: {
    user: true,
    platform: true,
    },
      orderBy: {
        createdAt: "desc",
      },
    })

    return Response.json(tradeaccount)
  } catch (error) {
    console.error(error)
    return new Response("Error fetching tradeaccount", { status: 500 })
  }
}



export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. รับค่า (Destructuring) ตามชื่อที่ Console log ออกมาเป๊ะๆ
    const { platformAccountId, PlatformName,InvestorPassword, user } = body;

    // 2. ตรวจสอบว่ามีค่าส่งมาครบไหม
    if (!platformAccountId || !PlatformName || !user) {
      return NextResponse.json(
        { error: "Missing required fields" }, 
        { status: 400 }
      );
    }

    // 3. บันทึกลง Database
    const newtrader = await prisma.tradeAccount.create({
      data: {
        // ใส่ค่าให้ตรงกับชื่อ Field ใน Schema (ซ้าย = ชื่อใน DB, ขวา = ค่าจาก Frontend)
        
        platformAccountId: platformAccountId,
        
        InvestorPassword : InvestorPassword,
        PlatformName: PlatformName, 
        
        email: user, 
        

      },
    });

    return NextResponse.json(newtrader);

  } catch (error) {
    console.error("Create Account Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: String(error) }, 
      { status: 500 }
    );
  }
}