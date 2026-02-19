import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const symbol = id;

  const { searchParams } = new URL(request.url);
  const count = searchParams.get("count") || "100";
  // 👇 รับค่า timeframe (ถ้าไม่มีให้เป็น H1)
  const timeframe = searchParams.get("timeframe") || "H1"; 

  try {
    // 👇 ส่ง timeframe ไปที่ Python ด้วย
    const res = await fetch(`http://127.0.0.1:8000/get-candles/${symbol}?count=${count}&timeframe=${timeframe}`, {
      cache: 'no-store' 
    });
    if (!res.ok) {
      // ถ้า Python ตอบ 404 มา Next.js ก็จะตอบ 404 กลับไปที่หน้าเว็บ
      return NextResponse.json({ error: "Data source error" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);

  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}