import prisma from "@/lib/prisma"; 
import { type NextRequest } from "next/server";
/**
 * @swagger
 * /api/linkmodel:
 *   get:
 *     summary: ดึงรายการ LinkModel
 *     description: |
 *       ดึงข้อมูล linkModel ทั้งหมด
 *       สามารถค้นหาได้ด้วย query parameter `search`
 *       โดยจะค้นจาก namefile (case-insensitive)
 *     tags:
 *       - LinkModel
 *
 *     parameters:
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *         description: คำค้นหาชื่อไฟล์
 *         example: model
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
 *                   namefile:
 *                     type: string
 *                     example: model_v1.pt
 *                   Pathname:
 *                     type: string
 *                     example: /models/model_v1.pt
 */
export async function GET(request:NextRequest){
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search') || ''
    const linkModel = await prisma.linkModel.findMany({ 
        where: {
            namefile: {
                contains: search,
                mode: 'insensitive'
            }
        }
    })
    return Response.json(linkModel)
}
/**
 * @swagger
 * /api/linkmodel:
 *   post:
 *     summary: สร้าง LinkModel ใหม่
 *     description: |
 *       เพิ่มข้อมูล linkModel ใหม่
 *       ถ้ามี namefile และ Pathname ซ้ำจะไม่สามารถสร้างได้
 *     tags:
 *       - LinkModel
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - namefile
 *               - Pathname
 *             properties:
 *               namefile:
 *                 type: string
 *                 example: model_v1.pt
 *               Pathname:
 *                 type: string
 *                 example: /models/model_v1.pt
 *
 *     responses:
 *       200:
 *         description: สร้างข้อมูลสำเร็จ
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
       
        const {namefile,Pathname} = await request.json()
         const existing = await prisma.linkModel.findUnique({
        where: { 
            namefile,
            Pathname
         }
        })

        if (existing) {
        return new Response("Symbol already exists", { status: 400 })
        }
        const newlinkmodel = await prisma.linkModel.create({
            data:{
            namefile,
            Pathname
            }
        })
        return Response.json(newlinkmodel)  
    }catch (error){
        return new Response(error as BodyInit,{
            status:500,
        })
    }
}