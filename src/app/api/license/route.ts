import prisma from "@/lib/prisma"; 
import { NextResponse } from "next/server";
import { addDays } from "date-fns";

export async function GET() {
  try {
    const licenseKey = await prisma.licenseKey.findMany({
      include: {
        tradeAccount: true,
        model: true,
    },
      orderBy: {
        createdAt: "desc",
      },
    })

    return Response.json(licenseKey)
  } catch (error) {
    console.error(error)
    return new Response("Error fetching tradeaccount", { status: 500 })
  }
}





export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { licensekey, platformAccountId, nameEA ,email,commission} = body;
    console.log("awdawda")
    console.log(commission)
    if (!licensekey || !platformAccountId || !nameEA || !commission) {
      return NextResponse.json(
        { error: "ข้อมูลไม่ครบถ้วน" },
        { status: 400 }
      );
    }

    const createdAt = new Date();

    const result = await prisma.licenseKey.create({
      data: {
        licensekey,
        expireDate: addDays(createdAt, 7),
        email,
        tradeAccount: {
          connect: { platformAccountId }
        },
       
        model: {
          connect: { nameEA }
        },
        
        bills: {
          create: {
            profit: 0,
            commission: Number(commission ?? 0),
            exirelicendate: addDays(createdAt, 7),
            email:email,
            isPaid: false
          }
        }
      },

      include: {
        bills: true
      }
    });

    return NextResponse.json(result);

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Server Error", details: String(error) },
      { status: 500 }
    );
  }
}