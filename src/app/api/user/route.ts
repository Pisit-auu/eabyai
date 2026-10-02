import prisma  from "@/lib/prisma"; 
import { NextResponse } from 'next/server';

/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Get all users
 *     description: ดึงข้อมูล users ทั้งหมดพร้อม tradeAccounts และ platform
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userall:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *                       tradeAccounts:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                             accountNumber:
 *                               type: string
 *                             platform:
 *                               type: object
 *                               properties:
 *                                 id:
 *                                   type: integer
 *                                 name:
 *                                   type: string
 *       404:
 *         description: No buyer data found
 *       500:
 *         description: Failed to fetch top buyer
 */
export async function GET() {
  try {
    const userall = await prisma.user.findMany({
      include: {
          tradeAccounts: {
            include: {
              platform: true,
            },
          },
        },
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
