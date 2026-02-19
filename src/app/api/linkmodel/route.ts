import prisma from "@/lib/prisma"; 
import { type NextRequest } from "next/server";
//ดึงข้อมูล
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
//สร้างข้อมูล  
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