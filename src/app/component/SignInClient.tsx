'use client'

import { signIn, useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation" // <--- 1. เพิ่ม useSearchParams
import React from 'react'
import { Modal, Button, Empty, Spin } from 'antd';

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

    const destination = '/document'
    const verifyUrl = `/api/auth/callback/email?email=${encodeURIComponent(email)}&token=${otp}&callbackUrl=${encodeURIComponent(destination)}`
    
    window.location.href = verifyUrl
  }
  const handleGoogleLogin = () => {
    signIn('google', { callbackUrl: '/user' })
  }

  const [modeldetailopen, setmodeldetailopen] = useState(false)
  const [ Documentopen , setDocumentopen] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const openPreview = (src: string) => {
  setPreviewImage(src);
};




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
                
            </header>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <input 
                type="email" 
                placeholder="ระบุ email ของคุณ เพื่อ Login ด้วย otp" 
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

            <button 
                onClick={handleGoogleLogin} 
                className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl border-2 border-slate-200 bg-white text-slate-700 font-bold hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all active:scale-95 shadow-sm"
              >
                <svg width="20" height="20" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                Continue with Google
              </button>
          </div>

          {/* Right: Preview Image */}
          <div className="w-full flex flex-col gap-6 pb-6 lg:pb-0">
            
            {/* Video Container */}
            <div className="rounded-[2.5rem] overflow-hidden shadow-2xl 
                aspect-video relative border border-slate-200">
                                <div className="absolute inset-0 bg-slate-900/10 z-10 pointer-events-none"></div>

              <iframe 
                className="w-full h-full z-0 border-0" 
                src="https://www.youtube.com/embed/xeLtkYELNwI?autoplay=1&mute=1&loop=1&playlist=xeLtkYELNwI&controls=1" 
                title="YouTube video player" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>

            {/* Action Buttons (เรียงแนวตั้งในมือถือ แนวนอนในจอใหญ่) */}
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              
              {/* Button: Document */}
              <button 
              onClick={() => setDocumentopen(true)}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl border-2 border-slate-200 bg-white text-slate-700 font-bold hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all active:scale-95 shadow-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                Document
              </button>
              
            <button 
              onClick={() => setmodeldetailopen(true)}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl border-2 border-slate-200 bg-white text-slate-700 font-bold hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all active:scale-95 shadow-sm">
          
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {/* รูปทรงหัวหุ่นยนต์ */}
            <rect x="4" y="8" width="16" height="12" rx="2" ry="2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            {/* รายละเอียดหู, ตา, ปาก, เสาอากาศ */}
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 14h2M20 14h2M9 13v2M15 13v2M12 8V4M10 2h4M9 17h6"></path>
          </svg>
          Model Detail
        </button>
            </div>
        

          </div>
                      <Modal
                        className="!rounded-2xl"
                        rootClassName="custom-modal" 
                        title={
                          <div className="flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full" />
                            <span className="text-xl font-black text-slate-800 tracking-tight">
                              รายละเอียด Model ของเรา
                            </span>
                          </div>
                        }
                        open={modeldetailopen}
                        onCancel={() => setmodeldetailopen(false)}
                        footer={null}
                        width={820}
                        centered
                      >
                        <div className="space-y-6 pt-2 bg-gradient-to-b from-white to-slate-50/50 rounded-2xl">

                          {/* Header Intro */}
                        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50
                px-4 py-3 rounded-xl border border-blue-100
                flex items-start gap-4 shadow-sm">

                         
                            {/* text */}
                            <p className="text-slate-600 text-sm leading-7">
                              ระบบ <span className="font-bold text-blue-600">AI Expert Advisor</span>{" "}
                              ของเรา ถูกพัฒนาเพื่อค้นหาจุดเข้าเทรดที่แม่นยำ
                              โดยผ่านการทดสอบจริงและเปิดให้ใช้งานแล้ว 2 โมเดลหลัก
                            </p>
                          </div>

                          {/* Cards */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* ===== CARD ===== */}
                        <div className="group relative rounded-2xl bg-white
                            shadow-[0_4px_20px_rgba(251,191,36,0.08)]
                            hover:shadow-[0_10px_35px_rgba(251,191,36,0.18)]
                            transition-all duration-300 border border-amber-100 p-6 ">

                          {/* top glow */}
                          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-t-2xl" />

                          <div className="mb-5">
                            <span className="text-[11px] font-bold text-amber-600 tracking-wider">
                              GOLD MODEL
                            </span>
                            <h3 className="text-4xl font-black text-slate-800 mt-2 tracking-tight">
                              XAUUSD
                            </h3>
                          </div>

                          <div className="space-y-3 text-sm">

                            {[
                              ["Timeframe","H1 (1 ชั่วโมง)"],
                              ["Platform","MT4 / MT5"],
                              ["Backtest Winrate","100%"],
                              ["Forward Test","100%"],
                              ["Max Drawdown","< 5.0%"],
                            ].map(([k,v])=>(
                              <div key={k} className="flex justify-between items-center border-b border-slate-100 pb-2">
                                <span className="text-slate-500">{k}</span>
                                <span className="font-bold text-slate-800">{v}</span>
                              </div>
                            ))}

                            <div className="flex justify-between pt-1">
                              <span className="text-slate-500">Trading Style</span>
                              <div className="text-right">
                                <div className="font-bold text-slate-800">Trend Following</div>
                                <div className="text-[11px] text-slate-400">
                                  AI Momentum Analysis
                                </div>
                              </div>
                            </div>

                          </div>
                        </div>


                        {/* ===== CARD EURUSD ===== */}
                        <div className="group relative rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 p-6">

                          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-t-2xl" />

                          <div className="mb-5">
                            <span className="text-[11px] font-bold text-blue-600 tracking-wider">
                              FOREX MODEL
                            </span>
                            <h3 className="text-4xl font-black text-slate-800 mt-2 tracking-tight">
                              EURUSD
                            </h3>
                          </div>

                          <div className="space-y-3 text-sm">

                            {[
                              ["Timeframe","H1 (1 ชั่วโมง)"],
                              ["Platform","MT4 / MT5"],
                              ["Backtest Winrate","100%"],
                              ["Forward Test","100%"],
                              ["Max Drawdown","< 3.5%"],
                            ].map(([k,v])=>(
                              <div key={k} className="flex justify-between items-center border-b border-slate-100 pb-2">
                                <span className="text-slate-500">{k}</span>
                                <span className="font-bold text-slate-800">{v}</span>
                              </div>
                            ))}

                            <div className="flex justify-between pt-1">
                              <span className="text-slate-500">Trading Style</span>
                              <div className="text-right">
                                <div className="font-bold text-slate-800">Reversal & Support</div>
                                <div className="text-[11px] text-slate-400">
                                  AI Pattern Recognition
                                </div>
                              </div>
                            </div>

                          </div>
                        </div>

                      </div>

                          {/* Footer */}
                          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex gap-3 items-start">
                              <div className="mt-0.5 text-slate-400">
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                              </div>
                              <div>
                                  <h4 className="font-bold text-sm text-slate-800 mb-0.5">
                                      ระบบป้องกันความเสี่ยงขั้นสูง (Risk Management)
                                  </h4>
                                  <p className="text-xs text-slate-500 leading-relaxed">
                                      ทั้ง 2 โมเดลถูกออกแบบให้จัดการ Order อย่างเป็นระบบ ลดการเข้าออเดอร์ผิดเงื่อนไข และควบคุมความเสี่ยงอัตโนมัติ
                                  </p>
                              </div>
                          </div>
                          <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 shadow-sm hover:shadow-md transition flex gap-3 items-start">

                          <div className="mt-0.5 text-emerald-500">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V6m0 12v2" />
                            </svg>
                          </div>

                          <div>
                            <h4 className="font-bold text-sm text-emerald-900 mb-0.5">
                              การคิดค่าบริการ Commision
                            </h4>

                            <p className="text-xs text-emerald-700 leading-relaxed">
                              ทั้ง 2 โมเดล จะคิดค่าบริการหลังผู้ใช้ใช้งานทุกๆ 7 วัน โดยจะคิดจาก ค่า %commission ของ model ตัวนั้นๆ จากกำไรที่ EA ของเราทำให้กับผู้ใช้ 
                              ซึ่งต้องมากกว่าเท่ากับ 3.3USDขึ้นไป และหาก EA ของเราทำกำไรไม่ถึง หรือไม่ได้กำไร เราจะไม่คิดค่า commission กับผู้ใช้
                            </p>
                          </div>

                        </div>

                        </div>
                      </Modal>
<Modal
  title={
    <div className="flex items-center gap-2">
      <div className="w-1.5 h-5 bg-blue-600 rounded-full" />
      <span className="text-lg font-bold text-slate-800">คู่มือการใช้งานระบบ AI EA</span>
    </div>
  }
  open={Documentopen}
  onCancel={() => setDocumentopen(false)}
  footer={null}
  width={700}
>
  <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar">
    
    {/* --- ส่วนคำอธิบาย Model --- */}
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
      <h3 className="text-blue-800 font-bold flex items-center gap-2 mb-2">
        <span className="p-1 bg-blue-600 rounded text-white text-xs">รายละเอียดโมเดล</span>
     
      </h3>
      <p className="text-sm text-slate-600 leading-relaxed">
        EA ของเราใช้การประมวลผลสองชั้น: <br />
        1. <span className="font-semibold text-blue-700">1DCNN + LSTM:</span> วิเคราะห์แนวโน้มเพื่อตัดสินใจจังหวะ <span className="underline">Trade หรือ Wait</span> <br />
        2. <span className="font-semibold text-blue-700">LLM (Llama-3.2-3b-bnb):</span> เมื่อมีสัญญาณเทรด จะวิเคราะห์ทิศทางเพื่อทำนาย <span className="underline text-green-600 font-bold">BUY</span> หรือ <span className="underline text-red-600 font-bold">SELL</span>
      </p>
    </div>

    {/* --- ส่วนขั้นตอนการใช้งาน --- */}
    <div className="space-y-8">
      ขั้นตอนการใช้งาน  สามารถดูได้ตามนี้หรือใน Youtube ของเรา
      {/* Step 1 */}
      <section>
        
        <div className="flex items-center gap-3 mb-3">
          <span className="flex-shrink-0 w-7 h-7 bg-slate-800 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
          <h4 className="font-bold text-slate-800">เมื่อ Login เข้า website แล้วให้ลงทะเบียน Trader Account</h4>
        </div>
        <div className="ml-10 space-y-3">
          <p className="text-sm text-slate-600">กรอกข้อมูลบัญชีเทรดจริง (ID, Investor Password) เพื่อยืนยันสิทธิ์การใช้งานบน Platform MT5</p>
        <button
          onClick={() => openPreview("/doc1.png")}
          className="w-full h-full"
          >
          <img
            src="/doc1.png"
            alt="Step 1"
            className="w-full h-full object-contain"
          />
        </button>

      
        <button
          onClick={() => openPreview("/doc2.png")}
          className="w-full h-full"
          >
          <img
            src="/doc2.png"
            alt="Step 2"
            className="w-full h-full object-contain"
          />
        </button>
          <div className="bg-amber-50 border-l-4 border-amber-400 p-3 text-xs text-amber-800">
            <strong>หมายเหตุ:</strong>การแก้ไข/ลบ จะทำได้เฉพาะบัญชีที่ยังไม่ได้นำไปผูกกับ License เท่านั้น (ยังเป็น Icon สีแดง) และจะขึ้น สถานะ Connect 
            (ขึ้นรูปคนสีเขียว) ก็ต่อเมื่อ นำ EA ไปใส่ใน Chart แล้วข้อมูล Trade Account กับ Investor password ถูกต้องกับในระบบ ซึ่ง 1 Trade Id จะอยู่ได้เพียง 1 Account เท่านั้น
          </div>
        </div>
      </section>

      {/* Step 2 & 3 */}
      <section>
        <div className="flex items-center gap-3 mb-3">
          <span className="flex-shrink-0 w-7 h-7 bg-slate-800 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
          <h4 className="font-bold text-slate-800">เลือก Model และสร้าง License</h4>
        </div>
        <div className="ml-10 space-y-4">
          <p className="text-sm text-slate-600">เลือก Account, Timeframe, Symbol และโมเดลที่ต้องการใช้งาน</p>
             <button
                onClick={() => openPreview("/doc3.png")}
                className="w-full h-full"
                >
                <img
                  src="/doc3.png"
                  alt="Step 3"
                  className="w-full h-full object-contain"
                />
              </button>

              <p className="text-sm text-slate-600 font-medium">เมื่อบันทึกแล้ว ระบบจะออก License Key ให้กับคุณ</p>
                <button
                    onClick={() => openPreview("/doc4.png")}
                    className="w-full h-full"
                    >
                    <img
                      src="/doc4.png"
                      alt="Step 4"
                      className="w-full h-full object-contain"
                    />
                  </button>

              
                 <div className="bg-amber-50 border-l-4 border-amber-400 p-3 text-xs text-amber-800">
            <strong>หมายเหตุ:</strong>การลบ จะทำได้เฉพาะบัญชีที่ยังไม่ได้นำไปผูกกับ License เท่านั้น (ยังเป็น Icon สีแดง) และจะขึ้น สถานะ Connect 
            (ขึ้นรูปคนสีเขียว) ก็ต่อเมื่อ นำ EA ไปใส่ใน Chart แล้วข้อมูล Licnese , Trade Account กับ Investor password ถูกต้องกับในระบบ  ซึ่ง 1 Trade Id และ 1 model จะอยู่ได้เพียง 1 Account เท่านั้น
          </div>
        </div>
      </section>

      {/* Step 4 & 5 */}
      <section>
        <div className="flex items-center gap-3 mb-3">
          <span className="flex-shrink-0 w-7 h-7 bg-slate-800 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
          <h4 className="font-bold text-slate-800">DownLoad EA</h4>
        </div>
        <div className="ml-10 space-y-4">
              <button
                    onClick={() => openPreview("/doc5.png")}
                    className="w-full h-full"
                    >
                    <img
                      src="/doc5.png"
                      alt="Step 5"
                      className="w-full h-full object-contain"
                    />
                  </button>

              
          <p className="text-sm text-slate-600 font-medium italic underline">ให้คลิกที่ปุ่ม DownLoad EA เพื่อรับลิงก์ไฟล์ EA</p>
          
        </div>
      </section>

      {/* Step 6 - 9 */}
      <section>
        <div className="flex items-center gap-3 mb-3">
          <span className="flex-shrink-0 w-7 h-7 bg-slate-800 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
          <h4 className="font-bold text-slate-800">การติดตั้งบน MetaTrader 5 (MT5)</h4>
        </div>
        <div className="ml-10 space-y-4">
          <ol className="list-decimal text-sm text-slate-600 space-y-4 ml-4">
             <li>
               ก่อนเริ่ม  เปิดกราฟคู่เงินและ Timeframe ให้ตรงกับที่เลือกในเว็บ และติ๊ก <span className="font-bold text-blue-600">AlgoTrading</span> เพื่อเปลี่ยนจากสีแดงให้เป็นสีเขียว ดังรูป
                 <button
                    onClick={() => openPreview("/doc10.png")}
                    className="w-full h-full"
                    >
                    <img
                      src="/doc10.png"
                      alt="Step 10"
                      className="w-full h-full object-contain"
                    />
                  </button>
                
            </li>
   
            <li>
               เปิด MT5 แล้วไปที่ <span className="font-bold">File -&gt; Open Data Folder -&gt; MQL5 -&gt; Experts</span> หรือ Ctrl+shift+D
                 <button
                    onClick={() => openPreview("/doc6.png")}
                    className="w-full h-full"
                    >
                    <img
                      src="/doc6.png"
                      alt="Step 6"
                      className="w-full h-full object-contain"
                    />
                  </button>

                
            </li>
            <li>
          
            
              Extract ไฟล์ที่ได้ และนำไปใส่ในโฟลเดอร์ Experts ของ MT5 จากขั้นตอนที่ 4.2
              <ul className="list-disc ml-5 mt-1">
                    <button
                    onClick={() => openPreview("/doc7.png")}
                    className="w-full h-full"
                    >
                    <img
                      src="/doc7.png"
                      alt="Step 7"
                      className="w-full h-full object-contain"
                    />
                  </button>

              </ul>
            </li>
            <li>
             
              กลับไปที่ MT5 แล้ว จะเจอไฟล์ ที่เราลากเข้าไปอยู่ในส่วน Expert Advisor ตรงแถบ Navigator  
              <ul className="list-disc ml-5 mt-1">
                 <button
                    onClick={() => openPreview("/doc8.png")}
                    className="w-full h-full"
                    >
                    <img
                      src="/doc8.png"
                      alt="Step 8"
                      className="w-full h-full object-contain"
                    />
                  </button>

              
                <li>ตรงแถบ Common ติ๊กถูก "Allow Algo Trading"</li>
                <li>ตรงแถบ Input ให้ใส่ License key ให้ตรงกับในเว็บ</li>
              </ul>
             
            </li>
              <li>
                <span className="font-bold">Tools -&gt; Options -&gt; Expert Advisor</span> หรือ Ctrl+O
              <ul className="list-disc ml-5 mt-1">
                 <button
                    onClick={() => openPreview("/doc9.png")}
                    className="w-full h-full"
                    >
                    <img
                      src="/doc9.png"
                      alt="Step 9"
                      className="w-full h-full object-contain"
                    />
                  </button>


                <li>ตรงแถบ Common ติ๊กถูก "Allow Algo Trading"</li>
                <li>ตรงแถบ Common Input ให้ใส่ License key ให้ตรงกับในเว็บ</li>
               
              </ul>
               
            </li>
            <li>
              
              เมื่อทำสำเร็จ ตรง Experts จะแสดง log การทำงานของ EA
                  <button
                    onClick={() => openPreview("/doc11.png")}
                    className="w-full h-full"
                    >
                    <img
                      src="/doc11.png"
                      alt="Step 11"
                      className="w-full h-full object-contain"
                    />
                  </button>

            </li>
          </ol>
        </div>
      </section>

    </div>

    <div className="pt-4 pb-2 text-center">
      <div className="w-full bg-green-50 p-4 rounded-xl border border-green-100">
        <p className="text-green-700 font-bold text-sm"> ติดตั้งเสร็จสิ้น! ระบบ EA พร้อมทำงาน</p>
        
      </div>
    </div>

  </div>
      {previewImage && (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

        {/* backdrop */}
        <button
          className="absolute inset-0"
          onClick={() => setPreviewImage(null)}
          aria-label="Close image preview"
        />

        {/* image */}
        <img
          src={previewImage}
          alt="Preview"
          className="relative max-w-[90%] max-h-[90%] rounded-lg z-10"
        />
      </div>
    )}
</Modal>



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