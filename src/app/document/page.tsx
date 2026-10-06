'use client';

import React, { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ExportOutlined } from "@ant-design/icons";
import Navbar from "@/app/component/header";
import SidebarItem from "@/app/component/sidebar";

const DocumentationPage = () => {
  const { data: session } = useSession();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const openPreview = (src: string) => setPreviewImage(src);
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' })
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-800 overflow-hidden">
      <Navbar
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setIsSidebarOpen}
        handleLogout={handleLogout}
        isAdmin={session?.user?.role === 'admin'}
        userImage={session?.user?.image}
      />

      <div className="flex flex-1 min-h-0 overflow-hidden">
      <aside className={`bg-white transition-all duration-300 z-20 overflow-hidden shrink-0 ${isSidebarOpen ? 'w-64' : 'w-0'}`}>
        <div className={`w-64 h-full border-r border-slate-200 flex flex-col py-4 transition-opacity duration-200 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <SidebarItem label="Document" href="/document" />
          <SidebarItem label="Dashboard" href="/dashboard" />
          <SidebarItem label="User Profile" href="/user" />
          <SidebarItem label="Trade Account" href="/trade-account" />
          <SidebarItem label="Expert Advisor" href="/EA" />
          <SidebarItem label="Billing" href="/Bill" />
        </div>
      </aside>

        {/* SCROLLABLE CONTENT */}
        <main className="flex-1 overflow-y-auto pb-20 custom-scrollbar">
          <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900 pb-5 border-b border-slate-200">คู่มือการใช้งานระบบ</h1>
           <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-sm text-amber-800">
            <strong>หมายเหตุ: </strong>ผู้ใช้ควรมีงบประมาณ 100 USD
          </div>
            
            {/* --- ส่วนคำอธิบาย Model --- */}
            <section className="bg-white p-6 rounded-lg border border-slate-200">
              <h2 className="text-slate-900 font-semibold mb-3">
                                รายละเอียดโมเดล
              </h2>
              <p className="text-sm md:text-base text-slate-700 leading-relaxed">
                EA ของเราใช้การประมวลผลสองชั้นเพื่อประสิทธิภาพสูงสุด: <br />
                1. <span className="font-semibold text-slate-900">1DCNN + LSTM:</span> วิเคราะห์แนวโน้มเพื่อตัดสินใจจังหวะ Trade หรือ Wait <br />
                2. <span className="font-semibold text-slate-900">LLM (Llama-3.2-3b-bnb):</span> เมื่อมีสัญญาณเทรด จะวิเคราะห์ทิศทางเพื่อทำนาย <span className="font-medium text-slate-900">BUY</span> หรือ <span className="font-medium text-slate-900">SELL</span>
              </p>
            </section>
            <a href="https://youtu.be/xeLtkYELNwI?si=ueideVGX3PaVHR6w" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline">
              ดูวิดีโอขั้นตอนการใช้งานบน YouTube <ExportOutlined />
            </a>


            {/* --- Step 1 --- */}
            <div className="space-y-6">
              <section className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex-shrink-0 w-7 h-7 bg-slate-900 text-white text-sm rounded-full flex items-center justify-center font-medium">1</span>
                   <Link  href={'/trade-account'}  >
                    <h3 className="font-semibold text-lg text-slate-800">ลงทะเบียน Trader Account</h3>
                </Link>
                
                </div>
                
                <div className="ml-0 md:ml-11 space-y-4">
                  <p className="text-sm text-slate-600">
                    เมื่อ Login เข้า Website แล้ว ให้กรอกข้อมูลบัญชีเทรดจริง (ID, Investor Password) เพื่อยืนยันสิทธิ์การใช้งานบน Platform MT5
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button onClick={() => openPreview("/doc1.png")} className="rounded-lg overflow-hidden border border-slate-100 hover:ring-2 ring-blue-500 transition">
                      <img src="/doc1.png" alt="Step 1.1" className="w-full h-auto object-cover" />
                    </button>
                    <button onClick={() => openPreview("/doc2.png")} className="rounded-lg overflow-hidden border border-slate-100 hover:ring-2 ring-blue-500 transition">
                      <img src="/doc2.png" alt="Step 1.2" className="w-full h-auto object-cover" />
                    </button>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 p-4 text-xs md:text-sm text-amber-900 rounded-md">
                    <strong>หมายเหตุ:</strong> การแก้ไข/ลบ จะทำได้เฉพาะบัญชีที่ยังไม่ได้นำไปผูกกับ License เท่านั้น (ไอคอนสีแดง) 
                  </div>
                </div>
              </section>

              {/* --- Step 2 --- */}
              <section className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex-shrink-0 w-7 h-7 bg-slate-900 text-white text-sm rounded-full flex items-center justify-center font-medium">2</span>
                  <Link  href={'/EA'}  >
                     <h3 className="font-semibold text-lg text-slate-800">เลือก Model และสร้าง License</h3>
                </Link>
                 
                </div>
                
                <div className="ml-0 md:ml-11 space-y-4">
                  <p className="text-sm text-slate-600">เลือก Account, Timeframe, Symbol และโมเดลที่ต้องการใช้งาน</p>
                  <button onClick={() => openPreview("/doc3.png")} className="w-full max-w-2xl rounded-lg overflow-hidden border border-slate-100 hover:ring-2 ring-blue-500 transition">
                    <img src="/doc3.png" alt="Step 3" className="w-full h-auto" />
                  </button>
                  <p className="text-sm text-slate-600 font-medium">เมื่อบันทึกแล้ว ระบบจะออก License Key ให้กับคุณโดยอัตโนมัติ</p>
                  <button onClick={() => openPreview("/doc4.png")} className="w-full max-w-2xl rounded-lg overflow-hidden border border-slate-100 hover:ring-2 ring-blue-500 transition">
                    <img src="/doc4.png" alt="Step 4" className="w-full h-auto" />
                  </button>
                </div>
              </section>

              {/* --- Step 3 --- */}
              <section className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex-shrink-0 w-7 h-7 bg-slate-900 text-white text-sm rounded-full flex items-center justify-center font-medium">3</span>
                  <Link  href={'/EA'}  >
                      <h3 className="font-semibold text-lg text-slate-800">Download EA</h3>
                </Link>
                 
                </div>
                
                <div className="ml-0 md:ml-11 space-y-4">
                  <button onClick={() => openPreview("/doc5.png")} className="w-full max-w-2xl rounded-lg overflow-hidden border border-slate-100 hover:ring-2 ring-blue-500 transition">
                    <img src="/doc5.png" alt="Step 5" className="w-full h-auto" />
                  </button>
                  <p className="text-sm text-slate-600 font-medium italic underline decoration-blue-500">
                    ให้คลิกที่ปุ่ม Download EA เพื่อรับลิงก์ไฟล์สำหรับติดตั้ง
                  </p>
                </div>
              </section>

              {/* --- Step 4 (MT5) --- */}
              <section className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <span className="flex-shrink-0 w-7 h-7 bg-slate-900 text-white text-sm rounded-full flex items-center justify-center font-medium">4</span>
                  <h3 className="font-semibold text-lg text-slate-800">การติดตั้งบน MetaTrader 5 (MT5)</h3>
                </div>
                
                <div className="ml-0 md:ml-11 space-y-10">
                  {/* 4.1 */}
                  <div className="space-y-3">
                    <p className="text-sm text-slate-700 font-medium flex items-center gap-2">
                      <span className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center text-xs">4.1</span>
                      เปิดกราฟคู่เงินและ Timeframe ให้ตรงกับที่เลือก และเปิด <span className="text-blue-600 font-semibold">Algo Trading</span>
                    </p>
                    <button onClick={() => openPreview("/doc10.png")} className="w-full max-w-xl rounded-lg overflow-hidden border border-slate-100">
                      <img src="/doc10.png" alt="MT5 Step 1" className="w-full h-auto" />
                    </button>
                  </div>

                  {/* 4.2 */}
                  <div className="space-y-3">
                    <p className="text-sm text-slate-700 font-medium flex items-center gap-2">
                      <span className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center text-xs">4.2</span>
                      ไปที่เมนู <span className="font-semibold">File → Open Data Folder → MQL5 → Experts</span>
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
                       <span className="font-semibold">Tools -&gt; Options -&gt; Expert Advisor</span> หรือ Ctrl+O
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
                       <span className="font-semibold">เมื่อทำสำเร็จ ตรง Experts จะแสดง log การทำงานของ EA </span>
                    </p>
                    <button onClick={() => openPreview("/doc11.png")} className="w-full max-w-xl rounded-lg overflow-hidden border border-slate-100">
                      <img src="/doc11.png" alt="MT5 Step 3" className="w-full h-auto" />
                    </button>
                  </div>

                </div>
              </section>
            </div>

            {/* FINAL SUCCESS SECTION */}
            <section className="bg-white border border-slate-200 rounded-lg p-8 text-center mb-10">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              
              <Link  href={'/dashboard'}  >
                     <h3 className="text-xl font-semibold text-slate-900 mb-2 hover:text-blue-600 transition-colors">ติดตั้งเสร็จสิ้น EA พร้อมทำงาน</h3>
                     <p className="text-slate-500 text-sm max-w-md mx-auto">
                   * EA จะหยุดทำงานก็ต่อเมื่อผู้ใช้ปิดโปรแกรม MT5 หรือ License key หมดอายุ
              </p>
                </Link>
              
            </section>
          </div>
        </main>
      </div>

      {/* ===== IMAGE PREVIEW OVERLAY ===== */}
      {previewImage && (
        <div className="fixed inset-0 bg-slate-950/85 flex items-center justify-center z-[100] p-4">
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