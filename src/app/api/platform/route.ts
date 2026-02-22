import prisma from "@/lib/prisma"; 
import { type NextRequest } from "next/server";
/**
 * @swagger
 * /api/platform:
 *   get:
 *     summary: ดึงรายการ Platform ทั้งหมด
 *     description: |
 *       ดึงข้อมูล platform ทั้งหมด
 *       สามารถค้นหาได้ด้วย query parameter `search`
 *       โดยค้นจาก nameplatform (case-insensitive)
 *     tags:
 *       - Platform
 *
 *     parameters:
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *         description: คำค้นหาชื่อ platform
 *         example: MT5
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
 *                   nameplatform:
 *                     type: string
 *                     example: MT5
 */
export async function GET(request:NextRequest){
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search') || ''
    const platform = await prisma.platform.findMany({ 
        where: {
            nameplatform: {
                contains: search,
                mode: 'insensitive'
            }
        }
    })
    return Response.json(platform)
}
/**
 * @swagger
 * /api/platform:
 *   post:
 *     summary: สร้าง Platform ใหม่
 *     description: เพิ่ม platform ใหม่เข้าสู่ระบบ
 *     tags:
 *       - Platform
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nameplatform
 *             properties:
 *               nameplatform:
 *                 type: string
 *                 example: MT5
 *
 *     responses:
 *       200:
 *         description: สร้าง Platform สำเร็จ
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
        const {nameplatform} = await request.json()
        const newplatform = await prisma.platform.create({
            data:{
                nameplatform
            }
        })
        return Response.json(newplatform)  
    }catch (error){
        return new Response(error as BodyInit,{
            status:500,
        })
    }
}