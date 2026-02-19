'use client'
import SidebarItem from "@/app/component/sidebar"
import { signIn, useSession, signOut } from "next-auth/react"
import { useState, useEffect } from "react"
import { useRouter,usePathname } from "next/navigation"
import React from 'react'
import Navbar from "@/app/component/headeradmin"

export default function Billpage() {
  const [isSidebarOpen, setSidebarOpen] = useState(true) // ควบคุม Sidebar
  
  const router = useRouter()
  const { data: session, status } = useSession()

  // ส่วนจัดการ Redirect หลัง Login/Logout
  useEffect(() => {
    if (status === 'unauthenticated' ) {
      router.push('/')
    }
  }, [status])

  const handleLogout = async () => {
    // เมื่อ Logout ให้กลับไปที่หน้าแรก (/)
    await signOut({ callbackUrl: '/' })
  }



  // View สำหรับคน Login แล้ว (Dashboard)
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-[#1E293B]">
      {/* Navbar ขนาดใหญ่ (h-20) */}
      <Navbar   isSidebarOpen={isSidebarOpen}  setSidebarOpen={setSidebarOpen}   handleLogout={handleLogout} />

      <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar */}
                    <aside className={`bg-[#1E293B] transition-all duration-300 shadow-xl z-20 ${isSidebarOpen ? 'w-64' : 'w-0'}`}>
                      <div className={`w-64 flex flex-col py-6 transition-opacity duration-200 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                                    <SidebarItem label="Setup" href="/admin/setup" />
                                               <SidebarItem label="Expert Advisor" href="/admin/EA" />
                                               <SidebarItem label="Billing" href="/admin/Bill" />
                      </div>
                    </aside>

        {/* Content Area */}
        <main className="flex-1 p-10 overflow-y-auto bg-slate-50">
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 min-h-[600px] p-8">
             <h2 className="text-2xl font-bold">ยินดีต้อนรับ: {session?.user?.email}</h2>
             
          </div>
        </main>
      </div>

    </div>
  )
}

