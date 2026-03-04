import { NextResponse } from "next/server"

export async function GET(req: Request) {
  console.log("HIT")
  try {
    const { searchParams } = new URL(req.url)

    const symbol = searchParams.get("symbol")
    const timeframe = searchParams.get("timeframe")
    const nameEA = searchParams.get("nameEA")

    const response = await fetch(
      `http://127.0.0.1:8000/signal?symbol=${symbol}&timeframe=${timeframe}&nameEA=${nameEA}`,
      {
        method: "GET",
      }
    )

    const aiResult = await response.json()
    return NextResponse.json(aiResult)

  } catch (err) {
    return NextResponse.json({
      signal: "HOLD",
      error: "SERVER_ERROR",
    })
  }
}