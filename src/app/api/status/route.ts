// app/api/status/route.js
import { NextResponse } from 'next/server';
export async function GET() {
  return NextResponse.json({ status: 'ready', message: 'Next.js API is running' });
}