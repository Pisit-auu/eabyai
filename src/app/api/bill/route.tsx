import prisma from "@/lib/prisma"; 
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const bill = await prisma.bill.findMany({
        include: {
            license: {
                include: {
                    tradeAccount: true, 
                    model: true    
                        }
                }
            },
      orderBy: {
        createdAt: "desc",
      },
    })

    return Response.json(bill)
  } catch (error) {
    console.error(error)
    return new Response("Error fetching bill", { status: 500 })
  }
}




