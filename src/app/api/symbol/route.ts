import prisma from "@/lib/prisma"; 
import { type NextRequest } from "next/server";
/**
 * @swagger
 * /api/symbol/{id}:
 *   get:
 *     summary: ดึงข้อมูล Symbol ตามชื่อ
 *     description: ค้นหา symbol จาก nameSymbol
 *     tags:
 *       - Symbol
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ชื่อ symbol
 *         example: XAUUSD
 *
 *     responses:
 *       200:
 *         description: ดึงข้อมูลสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nameSymbol:
 *                   type: string
 *
 *       404:
 *         description: Not Found
 *
 *       500:
 *         description: Internal Server Error
 */
export async function GET(request:NextRequest){
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search') || ''
    const symbol = await prisma.symbol.findMany({ 
        where: {
            nameSymbol: {
                contains: search,
                mode: 'insensitive'
            }
        }
    })
    return Response.json(symbol)
}
/**
 * @swagger
 * /api/symbol:
 *   post:
 *     summary: สร้าง Symbol ใหม่
 *     description: |
 *       เพิ่ม symbol ใหม่เข้าสู่ระบบ
 *       ถ้ามี symbol ซ้ำจะไม่สามารถสร้างได้
 *     tags:
 *       - Symbol
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nameSymbol
 *             properties:
 *               nameSymbol:
 *                 type: string
 *                 example: XAUUSD
 *
 *     responses:
 *       200:
 *         description: สร้าง Symbol สำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *
 *       400:
 *         description: Symbol already exists
 *
 *       500:
 *         description: Server Error
 */
export async function POST(request: Request){
    try{
       
        const {nameSymbol} = await request.json()
         const existing = await prisma.symbol.findUnique({
        where: { nameSymbol }
        })

        if (existing) {
        return new Response("Symbol already exists", { status: 400 })
        }
        const newsymbol = await prisma.symbol.create({
            data:{
                nameSymbol
            }
        })
        return Response.json(newsymbol)  
    }catch (error){
        return new Response(error as BodyInit,{
            status:500,
        })
    }
}