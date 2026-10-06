'use client'
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { CheckOutlined, CloseOutlined, LockOutlined, BulbOutlined } from '@ant-design/icons';

export default function SetupGuideWidget({ userEmail }: { userEmail: string }) {
  const [isOpen, setIsOpen] = useState(true);
  const [activeStep, setActiveStep] = useState<number | null>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const pathname = usePathname();
  const router = useRouter();
 
const clickAction = async (step: any) => {
    if (step.id === 4) {
        try {
            // ดึงลิงก์ EA
            const res = await axios.get("/api/linkmodel");
            if (res.data?.length > 0) {
                const { Pathname, namefile } = res.data[0];
                const link = document.createElement("a");
                link.href = Pathname;
                link.download = namefile || "EA.zip";
                document.body.appendChild(link);
                link.click();
                link.remove();
            }

            // อัปเดต Progress สำหรับ Step 4 ลง Database
            await axios.put(`/api/user/${userEmail}`, { stepId: 4 });
            window.location.reload()

        } catch (error) {
            console.error("Step 4 Error:", error);
        }
    }

    // 2. ถ้าเป็น Step 1 (หรือ Step อื่นๆ ที่ต้องการ Auto-Update เมื่อกด)
    if (step.id === 1 || step.id === 5) {
        try {
            await axios.put(`/api/user/${userEmail}`, { stepId: step.id });
        } catch (error) {
            console.error("Update progress failed:", error);
        }
    }

    // 3. ย้ายหน้าไปยัง Path เสมอไม่ว่าจะสำเร็จหรือไม่
    router.push(step.actionPath);
};
  // ดึงข้อมูลจาก API
useEffect(() => {
  const fetchProgress = async () => {
    if (!userEmail) return;
    try {
      const res = await fetch(`/api/user/${userEmail}`);
      const result = await res.json();
      

      // ตรวจสอบว่าเป็น Array และมีข้อมูลข้างในไหม
      const userData = Array.isArray(result) ? result[0] : result;

      if (userData?.setupProgress) {
        setCompletedSteps(userData.setupProgress);
        
        const stepsIds = [1, 2, 3, 4, 5];
        // หา Step แรกที่ยังทำไม่เสร็จ
        const nextToComplete = stepsIds.find(id => !userData.setupProgress.includes(id));
        
        // ถ้าทำครบหมดแล้วอาจจะให้ activeStep เป็น null หรือ 5 ก็ได้
        setActiveStep(nextToComplete || null); 
      }
    } catch (err) {
      console.error("Fetch progress error:", err);
    }
  };
  fetchProgress();
}, [userEmail, pathname]);// Re-fetch เมื่อเปลี่ยนหน้าเผื่อมีการอัปเดต

  if (pathname === "/" || !userEmail) return null;

  const steps = [
    { id: 1, title: 'จัดการข้อมูล (User)', description: 'ลองเพิ่มชื่อหรือเปลี่ยนรูปโปรไฟล์ของคุณแล้วกดบันทึกข้อมูล', actionLabel: 'ไปหน้า User', actionPath: '/user' },
    { id: 2, title: 'ผูกบัญชีเทรด', description: 'เชื่อมต่อพอร์ตเทรดกับระบบ เพื่อนำไปใช้สร้างEA', actionLabel: 'ไปหน้า Trade Account', actionPath: '/trade-account' },
    { id: 3, title: 'สร้างกลยุทธ์ (EA)', description: 'ผูกบัญชี TradeAccount กับ Model เพื่อสร้าง EA ของคุณ', actionLabel: 'เริ่มสร้าง EA', actionPath: '/EA' },
    { id: 4, title: 'ดาวน์โหลดไฟล์', description: 'โหลดไฟล์ไปติดตั้งใน MT5 ได้ที่ปุ่ม Download EA ในหน้า Expert Advisor Management', actionLabel: 'หรือคลิ๊กที่นี่เพื่อ Download', actionPath: '/EA' },
    { id: 5, title: 'คู่มือการใช้งาน', description: 'สามารถเรียนรู้วิธีการใช้งานและการติดตั้งบนเครื่อง', actionLabel: 'ดู Document', actionPath: '/document' },
  ];

  const progressPercentage = (completedSteps.length / steps.length) * 100;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-80 mb-3 overflow-hidden flex flex-col animate-fadeIn">
          {/* Header */}
          <div className="px-4 py-3 border-b border-slate-200 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Setup guide</h3>
              <p className="num text-xs text-slate-500 mt-0.5">
                {completedSteps.length} / {steps.length} completed
              </p>
            </div>
            <button onClick={() => setIsOpen(false)} aria-label="ปิด Setup guide" className="w-8 h-8 flex items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors">
              <CloseOutlined />
            </button>
          </div>

          {/* Progress */}
          <div className="h-1 bg-slate-100">
            <div className="bg-blue-600 h-full transition-[width] duration-500" style={{ width: `${progressPercentage}%` }} />
          </div>

          {/* List Items */}
          <ol className="max-h-[350px] overflow-y-auto divide-y divide-slate-100">
            {steps.map((step, index) => {
              const isCompleted = completedSteps.includes(step.id);
              const isActive = activeStep === step.id;
              const isLocked = index > 0 && !completedSteps.includes(steps[index - 1].id);

              return (
                <li key={step.id}>
                  <button
                    disabled={isLocked}
                    onClick={() => setActiveStep(isActive ? null : step.id)}
                    aria-expanded={isActive}
                    className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-colors ${isLocked ? 'cursor-not-allowed' : 'hover:bg-slate-50'}`}
                  >
                    {isCompleted ? (
                      <span className="w-5 h-5 shrink-0 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center"><CheckOutlined /></span>
                    ) : isLocked ? (
                      <span className="w-5 h-5 shrink-0 rounded-full border border-slate-200 text-slate-300 text-[10px] flex items-center justify-center"><LockOutlined /></span>
                    ) : (
                      <span className={`num w-5 h-5 shrink-0 rounded-full border text-[11px] flex items-center justify-center ${isActive ? 'border-blue-600 text-blue-600' : 'border-slate-300 text-slate-500'}`}>{step.id}</span>
                    )}
                    <span className={`text-sm flex-1 ${isCompleted ? 'text-slate-400 line-through' : isLocked ? 'text-slate-400' : 'text-slate-800 font-medium'}`}>
                      {step.title}
                    </span>
                  </button>

                  {isActive && !isLocked && (
                    <div className="pl-12 pr-4 pb-4">
                      <p className="text-[13px] text-slate-600 mb-3 leading-relaxed">
                        {step.description}
                      </p>
                      <button
                        onClick={() => clickAction(step)}
                        className="h-8 px-3 rounded-md bg-blue-600 text-white text-[13px] font-medium hover:bg-blue-700 transition-colors"
                      >
                        {step.actionLabel}
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      )}

      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'ซ่อน Setup guide' : 'เปิด Setup guide'}
        aria-expanded={isOpen}
        className="h-10 pl-3 pr-4 rounded-full shadow-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
      >
        {isOpen ? <CloseOutlined /> : <BulbOutlined />}
        <span>Setup guide</span>
        {!isOpen && <span className="num text-xs text-slate-500">{completedSteps.length}/{steps.length}</span>}
      </button>
    </div>
  );
}
