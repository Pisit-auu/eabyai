import prisma from "@/lib/prisma"; 
import { type NextRequest } from "next/server";
//ดึงข้อมูล
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
//สร้างข้อมูล
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