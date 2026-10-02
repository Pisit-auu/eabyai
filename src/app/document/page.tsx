'use client';

import React, { useState } from "react";
import Link from "next/link";

const DocumentationPage = () => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const openPreview = (src: string) => setPreviewImage(src);

  // Helper สำหรับเมนู Sidebar
  const SidebarItem = ({ label, href }: { label: string; href: string }) => (
    <Link
      href={href}
      className="flex items-center gap-3 px-6 py-3 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors text-sm font-medium"
    >
      {label}
    </Link>
  );

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 overflow-hidden">
      
      {/* ===== SIDEBAR ===== */}
      <aside className={`bg-[#1E293B] transition-all duration-300 shadow-xl z-20 shrink-0 ${isSidebarOpen ? 'w-64' : 'w-0'}`}>
        <div className={`w-64 flex flex-col py-6 transition-opacity duration-200 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="px-6 mb-8">
            <h2 className="text-white font-bold text-xl tracking-tight">EA </h2>
          </div>
          <nav className="flex flex-col">
                            <SidebarItem label="User" href="/user" />
                            <SidebarItem label="Dashboard" href="/dashboard" />
                            <SidebarItem label="Trade Account" href="/trade-account" />
                            <SidebarItem label="Expert Advisor" href="/EA" />
                            <SidebarItem label="Billing" href="/Bill" />
                            <SidebarItem label="Document " href="/document" />
          </nav>
        </div>
      </aside>

      {/* ===== MAIN AREA ===== */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* HEADER */}
        <header className="sticky top-0 z-50 bg-[#1E293B] shadow-md shrink-0">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-white p-1 hover:bg-slate-700 rounded transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Link href="/trade-account" className="flex items-center gap-2 group">
              <div className="w-1.5 h-5 bg-blue-500 rounded-full group-hover:scale-110 transition" />
              <h1 className="text-lg font-semibold text-white">
                คู่มือการใช้งานระบบ 
              </h1>
            </Link>
          </div>
        </header>

        {/* SCROLLABLE CONTENT */}
        <main className="flex-1 overflow-y-auto pb-20 custom-scrollbar">
          <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
           <div className="bg-amber-50 border-l-4 border-amber-400 p-3 text-xs text-amber-800">
            <strong>หมายเหตุ: </strong>ผู้ใช้ควรมีงบประมาณ 100 USD
          </div>
            
            {/* --- ส่วนคำอธิบาย Model --- */}
            <section className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100 shadow-sm">
              <h2 className="text-blue-800 font-bold flex items-center gap-2 mb-3">
                <span className="px-2 py-1 bg-blue-600 rounded text-white text-xs uppercase">Model Details</span>
                รายละเอียดโมเดล
              </h2>
              <p className="text-sm md:text-base text-slate-700 leading-relaxed">
                EA ของเราใช้การประมวลผลสองชั้นเพื่อประสิทธิภาพสูงสุด: <br />
                1. <span className="font-semibold text-blue-700">1DCNN + LSTM:</span> วิเคราะห์แนวโน้มเพื่อตัดสินใจจังหวะ <span className="underline">Trade หรือ Wait</span> <br />
                2. <span className="font-semibold text-blue-700">LLM (Llama-3.2-3b-bnb):</span> เมื่อมีสัญญาณเทรด จะวิเคราะห์ทิศทางเพื่อทำนาย <span className="underline text-green-600 font-bold">BUY</span> หรือ <span className="underline text-red-600 font-bold">SELL</span>
              </p>
            </section>
            <Link href="https://youtu.be/xeLtkYELNwI?si=ueideVGX3PaVHR6w" className="flex items-center gap-2 group">
              <div className="w-1.5 h-5 bg-blue-500 rounded-full group-hover:scale-110 transition" />
                <p className="text-slate-500 text-sm italic">click เพื่อดูขั้นตอนการใช้งานแบบวิดีโอ บน Youtube ของเรา</p>

            </Link>


            {/* --- Step 1 --- */}
            <div className="space-y-6">
              <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-slate-800 text-white rounded-full flex items-center justify-center font-bold">1</span>
                   <Link  href={'/trade-account'}  >
                    <h3 className="font-bold text-lg text-slate-800">ลงทะเบียน Trader Account</h3>
                </Link>
                
                </div>
                
                <div className="ml-0 md:ml-11 space-y-4">
                  <p className="text-sm text-slate-600">
                    เมื่อ Login เข้า Website แล้ว ให้กรอกข้อมูลบัญชีเทรดจริง (ID, Investor Password) เพื่อยืนยันสิทธิ์การใช้งานบน Platform MT5
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button onClick={() => openPreview("/doc1.png")} className="rounded-xl overflow-hidden border border-slate-100 hover:ring-2 ring-blue-500 transition">
                      <img src="/doc1.png" alt="Step 1.1" className="w-full h-auto object-cover" />
                    </button>
                    <button onClick={() => openPreview("/doc2.png")} className="rounded-xl overflow-hidden border border-slate-100 hover:ring-2 ring-blue-500 transition">
                      <img src="/doc2.png" alt="Step 1.2" className="w-full h-auto object-cover" />
                    </button>
                  </div>

                  <div className="bg-amber-50 border-l-4 border-amber-400 p-4 text-xs md:text-sm text-amber-900 rounded-r-lg">
                    <strong>หมายเหตุ:</strong> การแก้ไข/ลบ จะทำได้เฉพาะบัญชีที่ยังไม่ได้นำไปผูกกับ License เท่านั้น (ไอคอนสีแดง) 
                  </div>
                </div>
              </section>

              {/* --- Step 2 --- */}
              <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-slate-800 text-white rounded-full flex items-center justify-center font-bold">2</span>
                  <Link  href={'/EA'}  >
                     <h3 className="font-bold text-lg text-slate-800">เลือก Model และสร้าง License</h3>
                </Link>
                 
                </div>
                
                <div className="ml-0 md:ml-11 space-y-4">
                  <p className="text-sm text-slate-600">เลือก Account, Timeframe, Symbol และโมเดลที่ต้องการใช้งาน</p>
                  <button onClick={() => openPreview("/doc3.png")} className="w-full max-w-2xl rounded-xl overflow-hidden border border-slate-100 hover:ring-2 ring-blue-500 transition">
                    <img src="/doc3.png" alt="Step 3" className="w-full h-auto" />
                  </button>
                  <p className="text-sm text-slate-600 font-medium">เมื่อบันทึกแล้ว ระบบจะออก License Key ให้กับคุณโดยอัตโนมัติ</p>
                  <button onClick={() => openPreview("/doc4.png")} className="w-full max-w-2xl rounded-xl overflow-hidden border border-slate-100 hover:ring-2 ring-blue-500 transition">
                    <img src="/doc4.png" alt="Step 4" className="w-full h-auto" />
                  </button>
                </div>
              </section>

              {/* --- Step 3 --- */}
              <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-slate-800 text-white rounded-full flex items-center justify-center font-bold">3</span>
                  <Link  href={'/EA'}  >
                      <h3 className="font-bold text-lg text-slate-800">Download EA</h3>
                </Link>
                 
                </div>
                
                <div className="ml-0 md:ml-11 space-y-4">
                  <button onClick={() => openPreview("/doc5.png")} className="w-full max-w-2xl rounded-xl overflow-hidden border border-slate-100 hover:ring-2 ring-blue-500 transition">
                    <img src="/doc5.png" alt="Step 5" className="w-full h-auto" />
                  </button>
                  <p className="text-sm text-slate-600 font-medium italic underline decoration-blue-500">
                    ให้คลิกที่ปุ่ม Download EA เพื่อรับลิงก์ไฟล์สำหรับติดตั้ง
                  </p>
                </div>
              </section>

              {/* --- Step 4 (MT5) --- */}
              <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <span className="flex-shrink-0 w-8 h-8 bg-slate-800 text-white rounded-full flex items-center justify-center font-bold">4</span>
                  <h3 className="font-bold text-lg text-slate-800">การติดตั้งบน MetaTrader 5 (MT5)</h3>
                                 <Link href="https://youtu.be/xeLtkYELNwI?si=ueideVGX3PaVHR6w" className="flex items-center gap-2 group">
              <div className="w-1.5 h-5 bg-blue-500 rounded-full group-hover:scale-110 transition" />
                <p className="text-slate-500 text-sm italic">วิธีติดตั้ง EA บนเครื่อง</p>
                
            </Link>
                </div>
                
                <div className="ml-0 md:ml-11 space-y-10">
                  {/* 4.1 */}
                  <div className="space-y-3">
                    <p className="text-sm text-slate-700 font-medium flex items-center gap-2">
                      <span className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center text-xs">4.1</span>
                      เปิดกราฟคู่เงินและ Timeframe ให้ตรงกับที่เลือก และเปิด <span className="text-blue-600 font-bold">Algo Trading</span>
                    </p>
                    <button onClick={() => openPreview("/doc10.png")} className="w-full max-w-xl rounded-lg overflow-hidden border border-slate-100">
                      <img src="/doc10.png" alt="MT5 Step 1" className="w-full h-auto" />
                    </button>
                  </div>

                  {/* 4.2 */}
                  <div className="space-y-3">
                    <p className="text-sm text-slate-700 font-medium flex items-center gap-2">
                      <span className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center text-xs">4.2</span>
                      ไปที่เมนู <span className="font-bold">File → Open Data Folder → MQL5 → Experts</span>
                    </p>
                    <button onClick={() => openPreview("/doc6.png")} className="w-full max-w-xl rounded-lg overflow-hidden border border-slate-100">
                      <img src="/doc6.png" alt="MT5 Step 2" className="w-full h-auto" />
                    </button>
                  </div>

                  {/* 4.3 */}
                  <div className="space-y-3">
                    <p className="text-sm text-slate-700 font-medium flex items-center gap-2">
                      <span className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center text-xs">4.3</span>
                       Extract ไฟล์ที่ได้ และนำไปใส่ในโฟลเดอร์ Experts ของ MT5 จากขั้นตอนที่ 4.2
                    </p>
                    <button onClick={() => openPreview("/doc7.png")} className="w-full max-w-xl rounded-lg overflow-hidden border border-slate-100">
                      <img src="/doc7.png" alt="MT5 Step 3" className="w-full h-auto" />
                    </button>
                  </div>
                   {/* 4.4 */}
                  <div className="space-y-3">
                    <p className="text-sm text-slate-700 font-medium flex items-center gap-2">
                      <span className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center text-xs">4.4</span>
                       กลับไปที่ MT5 แล้ว จะเจอไฟล์ ที่เราลากเข้าไปอยู่ในส่วน Expert Advisor ตรงแถบ Navigator
                    </p>
                    <button onClick={() => openPreview("/doc8.png")} className="w-full max-w-xl rounded-lg overflow-hidden border border-slate-100">
                      <img src="/doc8.png" alt="MT5 Step 3" className="w-full h-auto" />
                    </button>
                    <li className=" text-xs">ตรงแถบ Common ติ๊กถูก "Allow Algo Trading"</li>
                    <li className="text-xs">ตรงแถบ Input ให้ใส่ License key ให้ตรงกับในเว็บ</li>
                  </div>
                   {/* 4.5 */}
                  <div className="space-y-3">
                    <p className="text-sm text-slate-700 font-medium flex items-center gap-2">
                      <span className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center text-xs">4.5</span>
                       <span className="font-bold">Tools -&gt; Options -&gt; Expert Advisor</span> หรือ Ctrl+O
                    </p>
                    <button onClick={() => openPreview("/doc9.png")} className="w-full max-w-xl rounded-lg overflow-hidden border border-slate-100">
                      <img src="/doc9.png" alt="MT5 Step 3" className="w-full h-auto" />
                    </button>
                         <li className="text-xs">ตรงแถบ Common ติ๊กถูก "Allow Algo Trading"</li>
                         <li className="text-xs">ตรงแถบ Input ให้ใส่ License key ให้ตรงกับในเว็บ</li>
                  </div>
                  {/* 4.6 */}
                  <div className="space-y-3">
                    <p className="text-sm text-slate-700 font-medium flex items-center gap-2">
                      <span className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center text-xs">4.6</span>
                       <span className="font-bold">เมื่อทำสำเร็จ ตรง Experts จะแสดง log การทำงานของ EA </span>
                    </p>
                    <button onClick={() => openPreview("/doc11.png")} className="w-full max-w-xl rounded-lg overflow-hidden border border-slate-100">
                      <img src="/doc11.png" alt="MT5 Step 3" className="w-full h-auto" />
                    </button>
                  </div>

                </div>
              </section>
            </div>

            {/* FINAL SUCCESS SECTION */}
            <section className="bg-[#1E293B] text-white rounded-3xl p-10 text-center shadow-xl mb-10">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/20">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              
              <Link  href={'/dashboard'}  >
                     <h3 className="text-2xl font-bold mb-2">ติดตั้งเสร็จสิ้น EA พร้อมทำงาน</h3>
                     <p className="text-slate-400 text-sm max-w-md mx-auto">
                   * EA จะหยุดทำงานก็ต่อเมื่อผู้ใช้ปิดโปรแกรม MT5 หรือ License key หมดอายุ
              </p>
                </Link>
              
            </section>
          </div>
        </main>
      </div>

      {/* ===== IMAGE PREVIEW OVERLAY ===== */}
      {previewImage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <button className="absolute inset-0 cursor-zoom-out" onClick={() => setPreviewImage(null)} />
          <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center">
             <button 
                onClick={() => setPreviewImage(null)}
                className="absolute -top-12 right-0 text-white hover:text-red-400 transition flex items-center gap-2"
             >
                <span className="text-sm font-medium">ปิดหน้าต่าง</span>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
             </button>
            <img src={previewImage} alt="Preview" className="relative max-w-full max-h-full rounded-lg shadow-2xl z-10 animate-in zoom-in duration-200" />
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentationPage;