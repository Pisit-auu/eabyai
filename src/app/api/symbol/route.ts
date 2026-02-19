import prisma from "@/lib/prisma"; 
import { type NextRequest } from "next/server";
//ดึงข้อมูล
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
//สร้างข้อมูล
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