'use client'
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import axios from 'axios';

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
    { id: 4, title: 'ดาวน์โหลดไฟล์', description: 'โหลดไฟล์ไปติดตั้งใน MT5 ได้ที่ปุ่มสีเขียวในหน้า Expert Advisor Management', actionLabel: 'หรือคลิ๊กที่นี่เพื่อ Download', actionPath: '/EA' },
    { id: 5, title: 'คู่มือการใช้งาน', description: 'สามารถเรียนรู้วิธีการใช้งานและการติดตั้งบนเครื่อง', actionLabel: 'ดู Document', actionPath: '/document' },
  ];

  const progressPercentage = (completedSteps.length / steps.length) * 100;

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {isOpen && (
        <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-80 mb-4 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="px-5 py-4 border-b flex justify-between items-center">
            <div>
              <h3 className="font-bold text-gray-800">Setup Guide</h3>
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">
                {completedSteps.length} / {steps.length} completed
              </p>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
          </div>

          {/* List Items */}
          <div className="max-h-[350px] overflow-y-auto">
            {steps.map((step, index) => {
              const isCompleted = completedSteps.includes(step.id);
              const isActive = activeStep === step.id;
              const isLocked = index > 0 && !completedSteps.includes(steps[index - 1].id);

              return (
                <div key={step.id} className={`border-b border-gray-50 last:border-0 ${isLocked ? 'bg-gray-50/50' : ''}`}>
                  <button
                    disabled={isLocked}
                    onClick={() => setActiveStep(isActive ? null : step.id)}
                    className={`w-full px-5 py-4 flex items-center text-left ${isLocked ? 'cursor-not-allowed' : 'hover:bg-gray-50'}`}
                  >
                    <div className="mr-3">
                      {isCompleted ? (
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor font-bold">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      ) : (
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isActive ? 'border-blue-600' : 'border-gray-300'}`}>
                          {isLocked && <span className="text-[10px]">🔒</span>}
                        </div>
                      )}
                    </div>
                    <span className={`text-sm flex-1 ${isCompleted ? 'text-gray-400 line-through' : 'text-gray-700 font-medium'}`}>
                      {step.title}
                    </span>
                  </button>

                  {isActive && !isLocked && (
        <div className="px-12 pb-5 animate-in slide-in-from-top-1 duration-200">
            <p className="text-xs text-gray-500 mb-3 leading-relaxed">
            {step.description}
            </p>
            
            <button 
            onClick={() => clickAction(step)} 
            className="inline-block bg-blue-600 text-white text-[10px] px-5 py-2.5 rounded-lg font-bold shadow-md hover:bg-blue-700 hover:shadow-lg transition-all active:scale-95 flex items-center gap-2"
            >
            <span>{step.actionLabel}</span>
            
            </button>
        </div>
)}
                </div>
              );
            })}
          </div>

          {/* Progress Bar */}
          <div className="px-5 py-3 bg-gray-50">
            <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full transition-all duration-700" style={{ width: `${progressPercentage}%` }} />
            </div>
          </div>
        </div>
      )}

      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`ml-auto w-16 h-16 rounded-full shadow-xl flex items-center justify-center transition-all ${isOpen ? 'bg-white text-gray-500' : 'bg-slate-700    text-white'}`}
      >
        {isOpen ? '✕' : '💡'}
      </button>
    </div>
  );
}