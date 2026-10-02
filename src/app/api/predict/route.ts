import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
   
    const body = await req.json()
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 60000)

    const response = await fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: controller.signal
    })

   clearTimeout(timeoutId)
   
    if (!response.ok) {
      return NextResponse.json({
        signal: "HOLD",
        error: "AI_SERVER_ERROR",
      })
    }

    // รับ response จาก AI
    const aiResult = await response.json()

    // ส่งกลับให้ EA
    console.log(aiResult)
    return NextResponse.json(aiResult)

  } catch (err) {
    console.error("Predict Error:", err)

    return NextResponse.json({
      signal: "HOLD",
      error: "SERVER_ERROR",
    })
  }
}