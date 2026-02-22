import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname

  // ดึง token จาก cookie
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })


  if (pathname.startsWith("/admin") && token?.role !== "admin") {
    return NextResponse.redirect(new URL("/user", req.url))
  }
   if (pathname.startsWith("/api-docs") && token?.role !== "admin") {
    return NextResponse.redirect(new URL("/user", req.url))
  }

  // ผ่านได้
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/:path*",
    "/admin/:path*",
  ],
}