'use client'

import { signIn, useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import React from 'react'
import { Modal, Spin } from 'antd';
import { ModelSheet, ImagePreview, MODEL_RESULTS } from '@/app/component/ModelSheet'

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

  const results = MODEL_RESULTS.map(m => ({
    symbol: m.symbol,
    forwardWin: m.forward.stats.find(s => s.label === 'Win rate')?.value,
    net: m.backtest.stats.find(s => s.label === 'Net profit')?.value,
    pf: m.backtest.stats.find(s => s.label === 'Profit factor')?.value,
    dd: m.backtest.stats.find(s => s.label === 'Max drawdown')?.value,
  }))

  return (
    <main className="min-h-screen bg-white flex flex-col text-slate-900">

      <nav className="sticky top-0 z-50 bg-white/95 border-b border-slate-200">
        <div className="max-w-6xl mx-auto h-14 px-4 md:px-6 flex justify-between items-center">
          <span className="text-[17px] font-semibold tracking-tight">
            EA<span className="text-slate-400">.AI</span>
          </span>
          <div className="flex items-center gap-1 sm:gap-2">
            <a href="#results" className="hidden sm:inline-flex h-9 items-center px-3 rounded-md text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors">ผลทดสอบ</a>
            <a href="#pricing" className="hidden sm:inline-flex h-9 items-center px-3 rounded-md text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors">ค่าบริการ</a>
            <button
              onClick={() => setLoginOpen(true)}
              className="h-9 px-4 rounded-md text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 transition-colors"
            >
              Log in
            </button>
          </div>
        </div>
      </nav>

      <section className="border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 md:px-6 pt-14 pb-12 md:pt-20 md:pb-16 grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-10 lg:gap-14 items-center">
          <div>
            <h1 className="text-[40px] md:text-[56px] font-semibold tracking-[-0.03em] leading-[1.05]">
              AI Trading<br />
              <span className="text-slate-400">Expert Advisor</span>
            </h1>
            <p className="text-slate-600 text-lg mt-6 max-w-md leading-relaxed">
              ยกระดับพอร์ตของคุณด้วยระบบ AI วิเคราะห์กราฟ ที่ทำงานแทนคุณตลอด 24 ชั่วโมง
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-8">
              <button
                onClick={() => setLoginOpen(true)}
                className="h-11 px-6 rounded-md font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                เริ่มใช้งาน
              </button>
              <a href="#results" className="h-11 px-5 inline-flex items-center rounded-md font-medium text-slate-700 border border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-colors">
                ดูผลทดสอบ
              </a>
            </div>
            <p className="text-[13px] text-slate-500 mt-6">XAUUSD · EURUSD · H1 · MetaTrader 5 · คิดค่าบริการจากกำไรจริง</p>
          </div>
          <div className="rounded-lg overflow-hidden border border-slate-200 bg-slate-900 aspect-video">
            <iframe
              className="w-full h-full"
              title="EA.AI demo"
              src="https://www.youtube.com/embed/fSNUthpy4-c?autoplay=1&mute=1&loop=1&playlist=fSNUthpy4-c"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 md:px-6 pb-12 md:pb-16">
          <div className="hidden sm:block border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-slate-500">
                  <th className="font-medium px-4 py-2.5">Model</th>
                  <th className="font-medium px-4 py-2.5 text-right">Win rate (forward)</th>
                  <th className="font-medium px-4 py-2.5 text-right">Max drawdown</th>
                  <th className="font-medium px-4 py-2.5 text-right">Net profit ($100, 1 ปี)</th>
                  <th className="font-medium px-4 py-2.5 text-right">Profit factor</th>
                </tr>
              </thead>
              <tbody>
                {results.map(r => (
                  <tr key={r.symbol} className="border-t border-slate-200">
                    <td className="px-4 py-3 font-medium">{r.symbol}</td>
                    <td className="num px-4 py-3 text-right">{r.forwardWin}</td>
                    <td className="num px-4 py-3 text-right text-rose-600">{r.dd}</td>
                    <td className="num px-4 py-3 text-right text-emerald-600">{r.net}</td>
                    <td className="num px-4 py-3 text-right">{r.pf}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="sm:hidden border border-slate-200 rounded-lg divide-y divide-slate-200">
            {results.map(r => (
              <div key={r.symbol} className="px-4 py-3 text-sm">
                <p className="font-medium mb-1.5">{r.symbol}</p>
                <dl>
                {[
                  ['Win rate (forward)', r.forwardWin, ''],
                  ['Max drawdown', r.dd, 'text-rose-600'],
                  ['Net profit ($100, 1 ปี)', r.net, 'text-emerald-600'],
                  ['Profit factor', r.pf, ''],
                ].map(([k, v, c]) => (
                  <div key={k} className="flex justify-between py-1">
                    <dt className="text-slate-500">{k}</dt>
                    <dd className={`num ${c}`}>{v}</dd>
                  </div>
                ))}
                </dl>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-20">
          <h2 className="text-[28px] md:text-[32px] font-semibold tracking-tight max-w-2xl">ใช้งานอะไรได้บ้าง</h2>
          <dl className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 border-t border-slate-200">
            {[
              ['ไม่จำกัด Trade Account', 'เชื่อม Trade Account ได้ไม่จำกัด เชื่อมต่อง่าย ใช้แค่ Trade Account ID และ Investor Password'],
              ['เลือก Model ได้เอง', 'เลือก Model ตาม Timeframe และ Symbol ที่จะเชื่อมกับ Trade Account ได้ตามต้องการ'],
              ['Dashboard ใช้งานง่าย', 'ดู Balance, Equity, กราฟ, Profit และ Trade History ได้ทันที'],
              ['ระบบ Bill', 'แสดงกำไร จุดเข้าเทรด และประวัติการเทรด ให้ตรวจสอบความถูกต้องได้'],
            ].map(([title, body]) => (
              <div key={title} className="pt-6 pb-2">
                <dt className="font-medium text-slate-900">{title}</dt>
                <dd className="text-slate-600 text-[15px] leading-relaxed mt-2">{body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section id="results" className="bg-slate-50 border-b border-slate-200 scroll-mt-14">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-20">
          <div className="max-w-2xl mb-10">
            <h2 className="text-[28px] md:text-[32px] font-semibold tracking-tight">รายละเอียด Model ของเรา</h2>
            <p className="text-slate-600 mt-3 leading-relaxed">
              ผล forward test และ backtest 1 ปีของแต่ละโมเดล พร้อมช่วงวันที่ทดสอบ ดู drawdown ประกอบกับ win rate เสมอ ผลในอดีตไม่ได้รับประกันผลในอนาคต
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {MODEL_RESULTS.map(m => (
              <ModelSheet key={m.symbol} model={m} onPreview={openPreview} />
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="scroll-mt-14">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-20 grid grid-cols-1 md:grid-cols-[1fr_1.6fr] gap-8 md:gap-16">
          <div>
            <h2 className="text-[28px] md:text-[32px] font-semibold tracking-tight">ค่าบริการและความเสี่ยง</h2>
            <button
              onClick={() => setLoginOpen(true)}
              className="mt-6 h-10 px-5 rounded-md text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 transition-colors"
            >
              เริ่มใช้งาน
            </button>
          </div>
          <dl className="divide-y divide-slate-200 border-y border-slate-200">
            <div className="py-6 grid sm:grid-cols-[160px_1fr] gap-2 sm:gap-6">
              <dt className="font-medium">Profit sharing</dt>
              <dd className="text-slate-600 leading-relaxed">
                คิดค่าบริการเพียง 10% จากกำไรจริงเท่านั้น หากไม่มีกำไร <span className="text-slate-900 font-medium">เราไม่คิดค่าบริการใดๆ</span> ให้คุณได้มั่นใจในประสิทธิภาพ
              </dd>
            </div>
            <div className="py-6 grid sm:grid-cols-[160px_1fr] gap-2 sm:gap-6">
              <dt className="font-medium">Risk control</dt>
              <dd className="text-slate-600 leading-relaxed">
                ระบบป้องกันความเสี่ยง จัดการ Order อย่างเป็นระบบ ลดความผิดพลาดจากอารมณ์ และควบคุมความเสี่ยงอัตโนมัติตลอด 24 ชม.
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <footer className="border-t border-slate-200 mt-auto">
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between text-[13px] text-slate-500">
          <span className="font-semibold text-slate-900">EA<span className="text-slate-400">.AI</span></span>
          <span>© {new Date().getFullYear()} EA.AI</span>
        </div>
      </footer>

      <Modal
        open={loginOpen}
        onCancel={() => setLoginOpen(false)}
        footer={null}
        centered
        width={400}
      >
        <div className="pt-2 pb-1">
          <h2 className="text-xl font-semibold tracking-tight">เข้าสู่ระบบ EA.AI</h2>
          <p className="text-slate-500 text-sm mt-1">ไม่ต้องสมัครสมาชิก ใช้เพียงแค่ Email — เราจะส่งรหัส OTP 6 หลักไปให้</p>

          <form onSubmit={handleLogin} className="space-y-3 mt-6">
            <label htmlFor="login-email" className="block text-sm font-medium text-slate-700">Email</label>
            <input
              id="login-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-10 px-3 rounded-md border border-slate-300 placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-shadow"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 rounded-md font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 transition-colors flex justify-center items-center gap-2"
            >
              {loading ? <Spin size="small" /> : "ส่งรหัส OTP"}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5 text-xs text-slate-400">
            <div className="flex-grow border-t border-slate-200"></div>
            หรือ
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          <button
            onClick={() => signIn('google', { callbackUrl: '/user' })}
            className="w-full h-10 flex items-center justify-center gap-2.5 rounded-md border border-slate-300 font-medium text-slate-800 hover:bg-slate-50 transition-colors"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4" alt="" />
            Continue with Google
          </button>
        </div>
      </Modal>

      <ImagePreview src={previewImage} onClose={() => setPreviewImage(null)} />

      <Modal
        open={isVerifying}
        onCancel={() => setIsVerifying(false)}
        footer={null}
        centered
        width={400}
      >
        <div className="pt-2 pb-1">
          <h2 className="text-xl font-semibold tracking-tight">ยืนยันรหัส OTP</h2>
          <p className="text-slate-500 text-sm mt-1">เราส่งรหัส 6 หลักไปที่ <span className="text-slate-900 font-medium">{email}</span></p>
          <form onSubmit={handleVerify} className="space-y-4 mt-6">
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              aria-label="OTP code"
              placeholder="000000"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              className="num w-full h-14 text-center text-3xl font-medium tracking-[0.35em] rounded-md border border-slate-300 placeholder:text-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-shadow"
            />
            <button type="submit" className="w-full h-10 rounded-md font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors">
              ยืนยันและเข้าสู่ระบบ
            </button>
          </form>
        </div>
      </Modal>

    </main>
  )
}
