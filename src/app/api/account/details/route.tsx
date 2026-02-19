// /api/account/details/route.ts
import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // console.log("Sending to Python:", body); 

    const res = await axios.post("http://127.0.0.1:8000/get-account-details", body);
    
    return NextResponse.json(res.data);
  
  } catch (error: any) {
    // 👈 บรรทัดนี้จะบอกว่า Python ตอบ Error อะไรกลับมา
    console.error("Python Error:", error.response?.data || error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}