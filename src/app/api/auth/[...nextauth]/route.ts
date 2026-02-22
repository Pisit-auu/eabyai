import { PrismaAdapter } from "@auth/prisma-adapter"
import NextAuth, { AuthOptions, DefaultSession } from "next-auth"
import EmailProvider from "next-auth/providers/email"
import GoogleProvider from "next-auth/providers/google"
import prisma from "@/lib/prisma"
import { Resend } from 'resend'
/**
 * @swagger
 * /api/auth/{nextauth}:
 *   get:
 *     summary: NextAuth authentication endpoint (GET)
 *     description: ใช้สำหรับ auth flow เช่น session, csrf, providers
 *     tags:
 *       - Authentication
 *     parameters:
 *       - in: path
 *         name: nextauth
 *         required: true
 *         schema:
 *           type: string
 *         description: NextAuth action (signin, session, csrf, callback)
 *     responses:
 *       200:
 *         description: Success
 *
 *   post:
 *     summary: NextAuth authentication endpoint (POST)
 *     description: ใช้สำหรับ login, callback และ verify email
 *     tags:
 *       - Authentication
 *     parameters:
 *       - in: path
 *         name: nextauth
 *         required: true
 *         schema:
 *           type: string
 *         description: NextAuth action
 *     responses:
 *       200:
 *         description: Success
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: string;
    } & DefaultSession["user"]
  }
  interface User {
    role?: string;
  }
}

// สร้าง Instance ของ Resend นอก Handler เพื่อ Performance

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true, 
    }),
    EmailProvider({
      // ส่วน server: {} ลบออกได้เลย เพราะเราใช้ Resend API แทน SMTP
      from: process.env.EMAIL_FROM, 
      maxAge: 10 * 60, // ปรับลดเหลือ 10 นาที (OTP ไม่ควรนานเกินไป)
      
      // สร้างเลข OTP 6 หลัก
      generateVerificationToken: async () => {
        const token = Math.floor(100000 + Math.random() * 900000).toString()
        return token
      },

      // ฟังก์ชันส่งอีเมลด้วย Resend
      sendVerificationRequest: async ({ identifier: email, token }) => {
        try {
          const resend = new Resend(process.env.RESEND_API_KEY!)
          await resend.emails.send({
            from: 'EA by Ai <onboarding@resend.dev>', // หรือ process.env.EMAIL_FROM
            to: email,
            subject: `รหัสเข้าสู่ระบบ EA: ${token}`,
            text: `รหัส OTP สำหรับเข้าสู่ระบบของคุณคือ: ${token}`,
            html: `
              <div style="font-family: sans-serif; text-align: center;">
                <h2>รหัสยืนยันตัวตน (OTP)</h2>
                <p>โปรดนำรหัสนี้ไปกรอกในหน้าเว็บไซต์เพื่อเข้าสู่ระบบ</p>
                <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #2563EB; margin: 20px 0;">
                  ${token}
                </div>
                <p style="color: #666; font-size: 14px;">รหัสนี้จะหมดอายุใน 10 นาที</p>
              </div>
            `,
          })
          console.log(`OTP sent to ${email}`)
        } catch (error) {
          console.error("Resend Error:", error)
          throw new Error("SEND_VERIFICATION_EMAIL_ERROR")
        }
      },
    }),
  ],
  pages: {
    signIn: '/', 
    verifyRequest: '/auth/verify', // หน้าแจ้งว่าส่งเมลแล้ว (ถ้าไม่ได้ใช้ popup)
    error: '/', 
  },
  callbacks: {
    async jwt({ token, user }) {
      // ทำงานเมื่อ User sign in ครั้งแรก หรือเมื่อ JWT ถูก update
      if (user) {
        token.id = user.id
        token.role = user.role || "user"
      }
      return token
    },
    async session({ session, token }) {
      // ส่งข้อมูลจาก Token ไปยัง Session (เพื่อให้ client เรียกใช้ได้)
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }