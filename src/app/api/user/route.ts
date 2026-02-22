import prisma  from "@/lib/prisma"; 
import { NextResponse } from 'next/server';

/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: ดึงข้อมูลผู้ใช้ทั้งหมด
 *     description: |
 *       ดึงรายการ user ทั้งหมดจากระบบ
 *     tags:
 *       - User
 *
 *     responses:
 *       200:
 *         description: ดึงข้อมูลผู้ใช้สำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userall:
 *                   type: array
 *                   items:
 *                     type: object
 *
 *       404:
 *         description: No buyer data found
 *
 *       500:
 *         description: Failed to fetch top buyer
 */
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
