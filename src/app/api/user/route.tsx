import prisma  from "@/lib/prisma"; 
import { NextResponse } from 'next/server';


export async function GET() {
  try {
    const userall = await prisma.user.findMany({
    });

    if (!userall) {
      return new NextResponse('No buyer data found', { status: 404 });
    }

    // ส่งกลับแค่ข้อมูล purchaseamount
    return NextResponse.json({ userall });
  } catch (error) {
    console.error('Error fetching top buyer:', error);
    return new NextResponse('Failed to fetch top buyer', { status: 500 });
  }
}
