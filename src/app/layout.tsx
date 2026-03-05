import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NextAuthProvider } from "./component/NextAuthProvider"
import "@/lib/cron";
import SetupGuideWidget from "./component/tipforuser";
import { getServerSession } from "next-auth"; // เพิ่มตัวนี้
import { authOptions } from "./api/auth/[...nextauth]/route"; // หรือพาธที่คุณเก็บ authOptions ไว้

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ea by Ai",
  description: "Ea by Ai",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // ดึง session จากฝั่ง server
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextAuthProvider>
          {/* ส่ง email เข้าไป ถ้าไม่มี email (ยังไม่ login) Widget จะไม่แสดงผล (ตามที่เราดักไว้) */}
          <SetupGuideWidget userEmail={session?.user?.email ?? ""} />
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}