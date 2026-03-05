'use client'

import { signIn, useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import React from 'react'
import { Modal, Spin } from 'antd';

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const openPreview = (src: string) => {
     setPreviewImage(src);
    };
  
  const router = useRouter()
  const { data: session, status } = useSession()
  const searchParams = useSearchParams()

  useEffect(() => {
    const errorParam = searchParams.get("error")
    if (errorParam) {
      let errorMessage = "เกิดข้อผิดพลาดในการเข้าสู่ระบบ"
      if (errorParam === "Verification") errorMessage = "รหัสยืนยันไม่ถูกต้อง หรือลิงก์หมดอายุแล้ว"
      else if (errorParam === "OAuthAccountNotLinked") errorMessage = "อีเมลนี้ถูกลงทะเบียนด้วยวิธีอื่นแล้ว"
      alert(errorMessage)
    }
  }, [searchParams])

  useEffect(() => {
    if (status === 'authenticated') router.push('/')
  }, [status, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const result = await signIn("email", { email, redirect: false })
    setLoading(false)
    if (result?.error) alert("เกิดข้อผิดพลาด: " + result.error)
    else {
      setLoginOpen(false)
      setIsVerifying(true)
    }
  }

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length !== 6) return alert("กรอกรหัสให้ครบ 6 หลัก")
    const destination = '/user'
    window.location.href = `/api/auth/callback/email?email=${encodeURIComponent(email)}&token=${otp}&callbackUrl=${encodeURIComponent(destination)}`
  }
  
  if (status === "loading") return null

  return (
    <main className="min-h-screen bg-white flex flex-col font-sans text-[#1E293B]">
      
      {/* 1. NAVBAR - Dark Theme */}
      <nav className="sticky top-0 bg-[#1E293B] py-5 px-8 shadow-xl z-50 mb-24">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span className="text-3xl font-black text-white tracking-tight">
            EA<span className="text-blue-400">.AI</span>
          </span>
          <button
            onClick={() => setLoginOpen(true)}
            className="px-6 py-2 rounded-xl  text-white font-bold transition-all "
          >
            Log In
          </button>
        </div>
      </nav>

      {/* 2. HERO SECTION - Light Theme (White) */}
      <section className="relative overflow-hidden bg-white py-20 md:py-32 ">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="z-10 text-center lg:text-left">
            <h1 className="text-6xl md:text-7xl font-black mb-6 tracking-tight leading-[1.1]">
              AI Trading<br />
              <span className="text-blue-600">Expert Advisor</span>
            </h1>
            <p className="text-slate-500 text-xl mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              ยกระดับพอร์ตของคุณด้วยระบบ <span className="text-[#1E293B] font-bold">AI วิเคราะห์กราฟอัจฉริยะ</span> ที่ทำงานแทนคุณตลอด 24 ชั่วโมง
            </p>
            <button
              onClick={() => setLoginOpen(true)}
              className="py-4 px-12 rounded-2xl font-black text-xl bg-[#1E293B] text-white hover:bg-slate-800 hover:-translate-y-1 transition-all shadow-2xl shadow-slate-300"
            >
             Get Start
            </button>
          </div>
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-[3rem] blur-2xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-[#1E293B]/5 aspect-video">
              <iframe 
                className="w-full h-full" 
                src="https://www.youtube.com/embed/y18H8TJYhA4?autoplay=1&mute=1&loop=1&playlist=y18H8TJYhA4" 
                allowFullScreen
              ></iframe>
            </div>
          </div>
          
        </div>


     <section className="bg-white py-24 overflow-hidden">

  <div className="max-w-7xl mx-auto px-6">


    <div className="flex gap-8 animate-scroll w-max">

      {/* CARD */}
      <div className="group flex gap-6 p-8 rounded-[2rem]
      bg-gradient-to-br from-slate-50 to-white
      border border-slate-200
      min-w-[360px]
      shadow-sm
      hover:shadow-xl
      hover:-translate-y-1
      transition duration-300">

        <div className="w-14 h-14 rounded-2xl
        bg-gradient-to-br from-emerald-400 to-teal-500
        flex items-center justify-center text-white shadow-md">
          🔐
        </div>

        <div>
          <h4 className="text-xl font-black mb-2 text-slate-900">
            ไม่จำกัด Trade Account
          </h4>

          <p className="text-slate-500">
            เชื่อม Trade Account ได้ไม่จำกัด ซึ่งเชื่อมต่อง่าย ใช้แค่เพียง Trade AccountId และ Investor Password
          </p>
        </div>

      </div>

      {/* CARD */}
      <div className="group flex gap-6 p-8 rounded-[2rem]
      bg-gradient-to-br from-slate-50 to-white
      border border-slate-200
      min-w-[360px]
      shadow-sm
      hover:shadow-xl
      hover:-translate-y-1
      transition duration-300">

        <div className="w-14 h-14 rounded-2xl
        bg-gradient-to-br from-purple-400 to-pink-500
        flex items-center justify-center text-white shadow-md">
          🤖
        </div>

        <div>
          <h4 className="text-xl font-black mb-2 text-slate-900">
            ผู้ใช้สร้าง Model ด้วยตัวเอง
          </h4>

          <p className="text-slate-500">
            ผู้ใช้สามารถเลือก Model ตาม Timeframe และ Symbol ที่จะเชื่อมกับ Trade Account ได้ตามต้องการ
          </p>
        </div>

      </div>

      {/* CARD */}
      <div className="group flex gap-6 p-8 rounded-[2rem]
      bg-gradient-to-br from-slate-50 to-white
      border border-slate-200
      min-w-[360px]
      shadow-sm
      hover:shadow-xl
      hover:-translate-y-1
      transition duration-300">

        <div className="w-14 h-14 rounded-2xl
        bg-gradient-to-br from-cyan-400 to-blue-500
        flex items-center justify-center text-white shadow-md">
          📊
        </div>

        <div>
          <h4 className="text-xl font-black mb-2 text-slate-900">
            มี Dashboard ที่ใช้งานง่าย
          </h4>

          <p className="text-slate-500">
           ผู้ใช้สามารถดู Total,Equipty,Graph,Profit และ Trade History ได้ทันที 
          </p>
        </div>

      </div>

      {/* CARD */}
      <div className="group flex gap-6 p-8 rounded-[2rem]
          bg-gradient-to-br from-slate-50 to-white
          border border-slate-200
          min-w-[360px]
          shadow-sm
          hover:shadow-xl
          hover:-translate-y-1
          transition duration-300">

        <div className="w-14 h-14 rounded-2xl
        bg-gradient-to-br from-orange-400 to-red-500
        flex items-center justify-center text-white shadow-md">
          💰
        </div>

        <div>
          <h4 className="text-xl font-black mb-2 text-slate-900">
            ระบบ Bill
          </h4>

          <p className="text-slate-500">
            แสดงกำไร จุดเข้าเทรด และรายประวัติการเทรด ทำให้ผู้ใช้ สามารถตรวจสอบความถูกต้องได้
          </p>
        </div>

      </div>

    </div>

  </div>
</section>

      </section>
    {/* 2. SERVICE INFO SECTION - Light Theme (White) */}

      {/* 3. MODEL DETAILS SECTION - Dark Theme (#1E293B) */}
<section className="bg-gradient-to-b from-slate-950 via-slate-900 to-black  py-24 text-white rounded-t-[0.5rem] -mt-10 relative z-10">
  <div className="max-w-7xl mx-auto px-6">
    {/* Header */}
    <div className="flex flex-col items-center mb-16 text-center">
      <span className="text-blue-400 font-bold tracking-[0.3em] uppercase mb-4 text-sm">
        Our Performance
      </span>
      <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">
        รายละเอียด Model ของเรา
      </h2>
      <div className="w-24 h-1.5 bg-blue-500 rounded-full mt-6 shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
    </div>
 
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      
      {/* CARD 1: XAUUSD */}
      <div className="group relative bg-white rounded-[0.5rem]  border border-slate-200 p-8 flex flex-col transition-all duration-500 hover:-translate-y-2 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-t-[2.5rem]" />
        
        <div className="mb-8 flex justify-between items-start">
          <div>
            <span className="inline-block px-3 py-1 bg-amber-50 text-amber-600 text-xs font-black tracking-wider rounded-full border border-amber-200">
              GOLD MODEL
            </span>
            <h3 className="text-5xl font-black text-slate-900 mt-4 tracking-tighter">XAUUSD</h3>
            <p className="text-slate-500 text-sm mt-1 font-medium">Timeframe: H1 (1 Hour)</p>
          </div>
          <div className="text-right">
            <span className="text-slate-400 text-xs font-bold uppercase block">Platform</span>
            <span className="text-xl font-bold text-slate-800">MT5</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => openPreview("/XAUUSDcurveback.png")}
          className="mb-8 overflow-hidden rounded-3xl border border-slate-100 shadow-sm relative block w-full group/img"
        >
          <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover/img:opacity-100 transition-all z-10 flex items-center justify-center backdrop-blur-[1px]">
            <span className="text-white bg-slate-900 px-6 py-2 rounded-full font-bold shadow-xl">
              คลิกเพื่อดูภาพขยาย
            </span>
          </div>
          <img src="/XAUUSDcurveback.png" alt="XAUUSD Equity Curve" className="w-full h-64 object-cover group-hover/img:scale-105 transition-transform duration-700" />
        </button>

        <div className="space-y-6">
          {/* Forward Test Stats */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200">
              <h4 className="font-black text-amber-600 text-sm uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
                Forward Test Results
              </h4>
              <span className="text-[10px] text-slate-400 font-bold">16/02/26 - 27/02/26</span>
            </div>
            <div className="grid grid-cols-2 gap-y-4 gap-x-8">
              <div className="flex justify-between items-end border-b border-slate-200/50 pb-1">
                <span className="text-slate-500 text-[11px] font-bold uppercase">Win Rate</span>
                <span className="text-xl font-black text-indigo-600">94.28%</span>
              </div>
              <div className="flex justify-between items-end border-b border-slate-200/50 pb-1">
                <span className="text-slate-500 text-[11px] font-bold uppercase">Total Trades</span>
                <span className="text-xl font-black text-slate-900">35</span>
              </div>
              <div className="flex justify-between items-end border-b border-slate-200/50 pb-1">
                <span className="text-slate-500 text-[11px] font-bold uppercase">Win</span>
                <span className="text-xl font-black text-emerald-600">33</span>
              </div>
              <div className="flex justify-between items-end border-b border-slate-200/50 pb-1">
                <span className="text-slate-500 text-[11px] font-bold uppercase">Loss</span>
                <span className="text-xl font-black text-rose-500">2</span>
              </div>
            </div>
          </div>

          {/* Backtest Stats */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200">
              <h4 className="font-black text-amber-600 text-sm uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>Backtest (1 Year)</h4>
                  <span className="text-[10px] text-slate-400 font-bold">17/01/25 - 30/01/26</span>
           
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
               <div className="flex justify-between">
                <span className="text-slate-400 text-[11px]">Deposit:</span>
                <span className="font-bold text-amber-500">$100</span>
              </div>

              
              <div className="flex justify-between">
                <span className="text-slate-400 text-[11px]">Net Profit:</span>
                <span className="font-bold text-emerald-400">+$502.34</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-[11px]">Win Rate:</span>
                <span className="font-black text-green-500">94.48%</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400 text-[11px]">Profit Factor:</span>
                <span className="font-bold text-blue-400">2.95</span>
              </div>
                            <div className="flex justify-between">
                <span className="text-slate-400 text-[11px]">Max Drawdown:</span>
                <span className="font-bold text-rose-400">47.97%</span>
              </div>
                            <div className="flex justify-between">
                <span className="text-slate-400 text-[11px]">Total Trades:</span>
                <span className="font-black text-slate-900">471</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CARD 2: EURUSD */}
      <div className="group relative bg-white rounded-[0.5rem] border border-slate-200 p-8 flex flex-col transition-all duration-500 hover:-translate-y-2 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-400 to-indigo-600 rounded-t-[2.5rem]" />
        
        <div className="mb-8 flex justify-between items-start">
          <div>
            <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-black tracking-wider rounded-full border border-blue-200">
              FOREX MODEL
            </span>
            <h3 className="text-5xl font-black text-slate-900 mt-4 tracking-tighter">EURUSD</h3>
            <p className="text-slate-500 text-sm mt-1 font-medium">Timeframe: H1 (1 Hour)</p>
          </div>
          <div className="text-right">
            <span className="text-slate-400 text-xs font-bold uppercase block">Platform</span>
            <span className="text-xl font-bold text-slate-800">MT5</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => openPreview("/EURUSDcurveback.png")}
          className="mb-8 overflow-hidden rounded-3xl border border-slate-100 shadow-sm relative block w-full group/img"
        >
          <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover/img:opacity-100 transition-all z-10 flex items-center justify-center backdrop-blur-[1px]">
            <span className="text-white bg-slate-900 px-6 py-2 rounded-full font-bold shadow-xl">
              คลิกเพื่อดูภาพขยาย
            </span>
          </div>
          <img src="/EURUSDcurveback.png" alt="EURUSD Equity Curve" className="w-full h-64 object-cover group-hover/img:scale-105 transition-transform duration-700" />
        </button>

        <div className="space-y-6">
          {/* Forward Test Stats */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200">
              <h4 className="font-black text-blue-600 text-sm uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                Forward Test Results
              </h4>
              <span className="text-[10px] text-slate-400 font-bold">02/02/26 - 13/02/26</span>
            </div>
            <div className="grid grid-cols-2 gap-y-4 gap-x-8">
              <div className="flex justify-between items-end border-b border-slate-200/50 pb-1">
                <span className="text-slate-500 text-[11px] font-bold uppercase">Win Rate</span>
                <span className="text-xl font-black text-indigo-600">92.85%</span>
              </div>
              <div className="flex justify-between items-end border-b border-slate-200/50 pb-1">
                <span className="text-slate-500 text-[11px] font-bold uppercase">Total Trades</span>
                <span className="text-xl font-black text-slate-900">14</span>
              </div>
              <div className="flex justify-between items-end border-b border-slate-200/50 pb-1">
                <span className="text-slate-500 text-[11px] font-bold uppercase">Win</span>
                <span className="text-xl font-black text-emerald-600">13</span>
              </div>
              <div className="flex justify-between items-end border-b border-slate-200/50 pb-1">
                <span className="text-slate-500 text-[11px] font-bold uppercase">Loss</span>
                <span className="text-xl font-black text-rose-500">1</span>
              </div>
            </div>
          </div>

          {/* Backtest Stats */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200">
              <h4 className="font-black text-blue-600 text-sm uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>Backtest (1 Year) </h4>
                 <span className="text-[10px] text-slate-400 font-bold">15/01/25 - 16/02/26</span>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                <div className="flex justify-between">
                <span className="text-slate-400 text-[11px]">Deposit:</span>
                <span className="font-bold text-violet-500">$100</span>
              </div>
               <div className="flex justify-between">
                <span className="text-slate-400 text-[11px]">Net Profit:</span>
                <span className="font-bold text-emerald-400">+$200.53</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-[11px]">Win Rate:</span>
                <span className="font-black text-green-500">86.59%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-[11px]">Profit Factor:</span>
                <span className="font-bold text-indigo-400">2.71</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400 text-[11px]">Max Drawdown:</span>
                <span className="font-bold text-rose-400">27.41%</span>
              </div>
                            <div className="flex justify-between">
                <span className="text-slate-400 text-[11px]">Total Trades:</span>
                <span className="font-black text-slate-900">246</span>
              </div>

            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</section>

      {/* 4. SERVICE INFO SECTION - Light Theme (White) */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex gap-6 p-8 rounded-[2rem] bg-slate-50 border border-slate-100">
            <div className="shrink-0 w-14 h-14 bg-[#1E293B] text-white rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
            </div>
            <div>
              <h4 className="text-xl font-black mb-2 uppercase tracking-tight">Security First</h4>
              <p className="text-slate-500 leading-relaxed">ระบบป้องกันความเสี่ยงขั้นสูง จัดการ Order อย่างเป็นระบบ ลดความผิดพลาดจากอารมณ์ และควบคุมความเสี่ยงอัตโนมัติตลอด 24 ชม.</p>
            </div>
          </div>

          <div className="flex gap-6 p-8 rounded-[2rem] bg-emerald-50 border border-emerald-100">
            <div className="shrink-0 w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V6m0 12v2" /></svg>
            </div>
            <div>
              <h4 className="text-xl font-black mb-2 text-emerald-900 uppercase tracking-tight">Profit Sharing</h4>
              <p className="text-emerald-700 leading-relaxed">คิดค่าบริการจากเพียง 10% จากกำไรจริงเท่านั้น หากไม่มีกำไร <span className="font-bold underline">เราไม่คิดค่าบริการใดๆ</span> ให้คุณได้มั่นใจในประสิทธิภาพ</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- MODALS --- */}
      <Modal
        open={loginOpen}
        onCancel={() => setLoginOpen(false)}
        footer={null}
        centered
        width={420}
        styles={{ body: { padding: '40px', borderRadius: '32px' } }}
      >
        <div className="text-center space-y-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-[#1E293B] text-white shadow-2xl">
            <span className="text-2xl font-black italic ">EA</span>
            <span className="text-2xl font-black italic text-blue-400 ">.AI</span>
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-800">Welcome</h2>
            <p className="text-slate-400 font-medium text-sm mt-2">ไม่ต้องสมัครสมาชิก ใช้เพียงแค่ Email</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-500 outline-none transition-all"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl font-bold bg-[#1E293B] text-white hover:bg-black transition-all flex justify-center items-center gap-2"
            >
              {loading ? <Spin size="small" className="brightness-0 invert" /> : "Receive OTP Code"}
            </button>
          </form>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-slate-100"></div>
            <span className="mx-4 text-[10px] font-black text-slate-600 uppercase">OR</span>
            <div className="flex-grow border-t border-slate-100"></div>
          </div>

          <button
            onClick={() => signIn('google', { callbackUrl: '/user' })}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl border-2 border-slate-100 font-bold hover:bg-slate-50 transition-all"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="google" />
            Continue with Google
          </button>
        </div>
      </Modal>

      {/* Image Preview Overlay */}
  {previewImage && (
        <div className="fixed inset-0 bg-[#1E293B]/95 flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300" onClick={() => setPreviewImage(null)}>
          <img src={previewImage} alt="Preview" className="max-w-full max-h-[85vh] rounded-3xl shadow-2xl border border-white/10" />
          <button className="absolute top-10 right-10 text-white/50 hover:text-white transition-colors">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      )}

      {/* OTP Modal ปรับให้เข้ากับธีมใหม่ */}
      {isVerifying && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#1E293B]/80 backdrop-blur-md" onClick={() => setIsVerifying(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 animate-in zoom-in duration-300">
            <div className="text-center">
              <h2 className="text-3xl font-black mb-2 text-[#1E293B]">Verify OTP</h2>
              <p className="text-slate-500 mb-8 text-sm">เราส่งรหัส 6 หลักไปที่ <span className="font-bold text-blue-600">{email}</span></p>
              <form onSubmit={handleVerify} className="space-y-6">
                <input
                  type="text"
                  placeholder="••••••"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  className="w-full text-center text-5xl font-black tracking-[0.4em] py-6 rounded-[2rem] border-2 border-slate-100 focus:border-blue-600 bg-slate-50 outline-none transition-all"
                />
                <button type="submit" className="w-full py-5 rounded-2xl font-black text-xl bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all">
                  Confirm & Login
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

    </main>
  )
}




          