import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

// ใช้ export default สำหรับ proxy.ts ใน Next.js 16
export default async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname

  // ดึง token จาก cookie
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })


  if (pathname === "/") {
    if (token) {
      const redirectUrl = token.role === "admin" ? "/admin/user" : "/user"
      return NextResponse.redirect(new URL(redirectUrl, req.url))
    }
    return NextResponse.next()
  }

  // 2. ดักจับหน้าที่ต้องล็อกอิน
  const isProtectedPath = pathname.startsWith("/user") || 
                          pathname.startsWith("/admin/user") || 
                          pathname.startsWith("/admin/setup") || 
                          pathname.startsWith("/admin/EA") || 
                          pathname.startsWith("/admin/Bill") || 
                          pathname.startsWith("/api-docs")

  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  // 3. จัดการสิทธิ์ (Role-based access) สำหรับ Admin
  if ((pathname.startsWith("/admin/user") ||pathname.startsWith("/admin/setup") ||pathname.startsWith("/admin/EA") ||pathname.startsWith("/admin/Bill") || pathname.startsWith("/api-docs")) && token?.role !== "admin") {
    return NextResponse.redirect(new URL("/user", req.url))
  }

  // ผ่านได้
  return NextResponse.next()
}

// ตั้งค่า Matcher เพื่อไม่ให้บล็อกไฟล์รูปและ CSS
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}