import prisma from "@/lib/prisma"; 
import { type NextRequest } from "next/server";
/**
 * @swagger
 * /api/timeframe:
 *   get:
 *     summary: ดึงรายการ Timeframe ทั้งหมด
 *     description: |
 *       ดึงข้อมูล timeframe ทั้งหมด
 *       สามารถค้นหาได้ด้วย query parameter `search`
 *       โดยค้นจาก nametimeframe (case-insensitive)
 *     tags:
 *       - Timeframe
 *
 *     parameters:
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *         description: คำค้นหา timeframe
 *         example: H1
 *
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
 *                   nametimeframe:
 *                     type: string
 *                     example: H1
 */
export async function GET(request:NextRequest){
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search') || ''
    const symbol = await prisma.timeframe.findMany({ 
        where: {
            nametimeframe: {
                contains: search,
                mode: 'insensitive'
            }
        }
    })
    return Response.json(symbol)
}
/**
 * @swagger
 * /api/timeframe:
 *   post:
 *     summary: สร้าง Timeframe ใหม่
 *     description: เพิ่ม timeframe ใหม่เข้าสู่ระบบ
 *     tags:
 *       - Timeframe
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nametimeframe
 *             properties:
 *               nametimeframe:
 *                 type: string
 *                 example: H1
 *
 *     responses:
 *       200:
 *         description: สร้าง Timeframe สำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *
 *       500:
 *         description: Server Error
 */
export async function POST(request: Request){
    try{
        const {nametimeframe} = await request.json()
        const newtimeframe = await prisma.timeframe.create({
            data:{
                nametimeframe
            }
        })
        return Response.json(newtimeframe)  
    }catch (error){
        return new Response(error as BodyInit,{
            status:500,
        })
    }
}