import prisma from "@/lib/prisma"; 
import { NextResponse } from "next/server";
/**
 * @swagger
 * /api/bill:
 *   get:
 *     summary: ดึงรายการบิลทั้งหมด
 *     description: |
 *       คืนค่ารายการ bill ทั้งหมด โดย include:
 *       - license
 *       - license.tradeAccount
 *       - license.model
 *     tags:
 *       - Bill
 *     responses:
 *       200:
 *         description: ดึงข้อมูลสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2026-02-22T10:00:00.000Z"
 *                   license:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 10
 *                       licensekey:
 *                         type: string
 *                         example: ABCD-1234-EFGH
 *                       tradeAccount:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 5
 *                           accountNumber:
 *                             type: string
 *                             example: "12345678"
 *                       model:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 3
 *                           name:
 *                             type: string
 *                             example: "EA Gold Pro"
 *       500:
 *         description: Error fetching bill
 */
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





