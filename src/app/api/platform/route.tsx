import prisma from "@/lib/prisma"; 
import { type NextRequest } from "next/server";
//ดึงข้อมูล
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
//สร้างข้อมูล
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