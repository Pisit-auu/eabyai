// /app/api/validate-mt5/route.ts (Example path)
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { platformAccountId, InvestorPassword, server } = body; // รับ server มาจาก body

    // 1. Validation
    if (!platformAccountId || !InvestorPassword || !server ) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }

    // 2. Call Python FastAPI (Assuming it runs on port 8000)
    // IMPORTANT: Use the full URL and match the keys Python expects
    

    const res = await fetch("http://127.0.0.1:8000/check-account", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accountId: platformAccountId,
        investorPassword: InvestorPassword,
        server: server,
      }),
    });

    const data = await res.json();
    
    if (!res.ok) {
        return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data);

  } catch (error: any) {
    return NextResponse.json(
      { error: "Python Server Unreachable", details: error.message },
      { status: 500 }
    );
  }
}