'use client'

import { signIn, useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation" // <--- 1. เพิ่ม useSearchParams
import React from 'react'

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false) 
  const router = useRouter()
  const { data: session, status } = useSession()
  const searchParams = useSearchParams()
  useEffect(() => {
    // 1. ดึงทั้ง error และ email จาก URL (ถ้ามี)
    const errorParam = searchParams.get("error")
    console.log(errorParam)
    if (errorParam) {
      let errorMessage = "เกิดข้อผิดพลาดในการเข้าสู่ระบบ"
      
      if (errorParam === "Verification") {
        errorMessage = "รหัสยืนยันไม่ถูกต้อง หรือลิงก์หมดอายุแล้ว"
      } else if (errorParam === "OAuthAccountNotLinked") {
        errorMessage = "อีเมลนี้ถูกลงทะเบียนด้วยวิธีอื่นแล้ว (เช่น Google)"
      } else if (errorParam === "Callback") {
        errorMessage = "เกิดข้อผิดพลาดในการยืนยันตัวตน"
      }
      
      alert(errorMessage)
    }
    // 4. เอา email ออกจาก dependency array เพื่อป้องกัน loop
  }, [searchParams, router])
  // ------------------------------------------------

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/')
    }
  }, [status, router])

  // ฟังก์ชันส่ง OTP (หน้าแรก)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const result = await signIn("email", { 
      email, 
      redirect: false,
      
    })

    setLoading(false)
    if (result?.error) {
      alert("เกิดข้อผิดพลาด: " + result.error)
    } else {
      setIsVerifying(true) 
    }
  }

  // ฟังก์ชันยืนยัน OTP (ใน Popup)
  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length !== 6) {
      alert("กรอกรหัสให้ครบ 6 หลัก")
      return
    }

    const destination = '/home'
    const verifyUrl = `/api/auth/callback/email?email=${encodeURIComponent(email)}&token=${otp}&callbackUrl=${encodeURIComponent(destination)}`
    
    window.location.href = verifyUrl
  }

  if (status === "loading") return null // หรือใส่ Spinner เล็กๆ

  return (
    <main className="min-h-screen bg-white flex flex-col font-sans text-[#1E293B] relative">
      {/* Navbar */}
      <nav className="bg-[#1E293B] py-5 px-8 shadow-lg z-10">
        <div className="max-w-7xl mx-auto">
          <span className="text-3xl font-black text-white tracking-tighter">EA</span>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Sign In Form */}
          <div className="max-w-md w-full mx-auto lg:mx-0">
            <header className="mb-10">
              <h1 className="text-4xl font-extrabold mb-3 tracking-tight">
                Expert Adviser <span className="text-blue-600 italic">by Ai</span>
              </h1>
              <p className="text-xl font-medium text-slate-400 ">Login by otp </p>
            </header>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <input 
                type="email" 
                placeholder="ระบุ email ของคุณ" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                className="w-full px-5 py-4 rounded-xl border-2 border-slate-200 focus:border-blue-600 outline-none text-lg transition-all"
              />
              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 rounded-xl font-bold text-lg bg-[#1E293B] text-white hover:bg-slate-800 shadow-lg active:scale-95 transition-all disabled:bg-slate-300"
              >
                {loading ? "กำลังส่ง..." : "รับรหัส OTP"}
              </button>
            </form>

            <div className="flex items-center gap-4 py-8">
                <div className="h-[1px] bg-slate-200 flex-1"></div>
                <span className="text-xs font-bold text-slate-400 uppercase">or</span>
                <div className="h-[1px] bg-slate-200 flex-1"></div>
            </div>

            <button onClick={() => signIn('google')} className="w-full border-2 border-slate-200 py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-slate-50 transition-all font-bold text-slate-700">
               <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
               Continue with Google
            </button>
          </div>

          {/* Right: Preview Image */}
          <div className="hidden lg:block">
            <div className="rounded-[2.5rem] overflow-hidden shadow-2xl bg-slate-900 aspect-video">
               <img src="../public/ania.png" className="w-full h-full object-cover opacity-80" alt="Preview" />
            </div>
          </div>
        </div>
      </div>

      {/* --- OTP VERIFICATION POPUP (MODAL) --- */}
      {isVerifying && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsVerifying(false)}></div>
          
          {/* Modal Card */}
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 animate-in fade-in zoom-in duration-300">
            <button 
              onClick={() => setIsVerifying(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              </div>
              <h2 className="text-2xl font-bold mb-2">ยืนยันรหัส OTP</h2>
              <p className="text-slate-500 mb-8 text-sm">
                เราได้ส่งรหัส 6 หลักไปที่ <br/>
                <span className="font-bold text-slate-900">{email}</span>
              </p>

              <form onSubmit={handleVerify} className="space-y-6">
                <input 
                  type="text" 
                  placeholder="0 0 0 0 0 0"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} // รับแค่ตัวเลข
                  className="w-full text-center text-3xl font-black tracking-[0.5em] py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-600 bg-slate-50 outline-none transition-all"
                  autoFocus
                />
              
                <button 
                  type="submit" 
                  className="w-full py-4 rounded-xl font-bold text-lg bg-gray-600 text-white hover:bg-gray-700 shadow-lg shadow-blue-200 active:scale-95 transition-all"
                >
                  ยืนยันและเข้าสู่ระบบ
                </button>
              </form>
              
              <button 
                onClick={() => setIsVerifying(false)}
                className="mt-6 text-sm font-semibold text-slate-400 hover:text-blue-600 transition-colors"
              >
                ย้อนกลับไปแก้ไข Email
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}