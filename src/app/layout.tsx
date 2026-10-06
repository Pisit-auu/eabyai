import type { Metadata } from "next";
import { Geist, Geist_Mono, Anuphan } from "next/font/google";
import "./globals.css";
import { NextAuthProvider } from "./component/NextAuthProvider"
import { AntdProvider } from "./component/AntdProvider"
import "@/lib/cron";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const anuphan = Anuphan({
  variable: "--font-anuphan",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "EA.AI — AI Expert Advisor for MT5",
  description: "เช่า Expert Advisor สำหรับ MT5 แบบแบ่งกำไร พร้อมผลทดสอบย้อนหลังและ forward test",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${geistSans.variable} ${geistMono.variable} ${anuphan.variable}`}>
      <body className="antialiased">
        <NextAuthProvider>
          <AntdProvider>
            {children}
          </AntdProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
