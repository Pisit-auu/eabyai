"use client"
import { useState } from 'react'
// 1. Import Avatar และ Icon จาก Ant Design
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import Link from 'next/link';
// 2. เพิ่ม userImage เข้าไปใน Props type (ใส่ ? เพราะอาจจะไม่มีรูปก็ได้)
type NavbarProps = {
  isSidebarOpen: boolean
  setSidebarOpen: (value: boolean) => void
  handleLogout: () => void
  isAdmin: boolean
  userImage?: string | null | undefined // <-- เพิ่มบรรทัดนี้
}

export default function Navbar({
  isSidebarOpen,
  setSidebarOpen,
  handleLogout,
  isAdmin,
  userImage 
}: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-[#1E293B] h-20 flex items-center justify-between px-8 shadow-xl z-30 relative">
      <div className="flex items-center gap-6">
        <button
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="text-white hover:bg-slate-700 p-2 rounded-xl transition-all"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <Link href={'/EA'}> <span className="text-4xl font-black text-white italic tracking-tighter">
          EA
        </span> </Link>
       
      </div>

      <div className="flex items-center gap-4">
        {/* User Menu Section */}
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            // ปรับ style ปุ่มให้เรียบลง เพื่อให้ Avatar เด่นขึ้น
            className="flex items-center justify-center rounded-full transition-all hover:ring-2 hover:ring-slate-400"
          >
            {/* 3. แทนที่ SVG เดิมด้วย Ant Design Avatar */}
            <Avatar 
              size={42} // ขนาดใกล้เคียงเดิม (w-10 h-10 คือ 40px)
              src={userImage} // ใส่ URL รูปตรงนี้
              icon={<UserOutlined />} // ถ้าไม่มีรูป ให้โชว์ไอคอนนี้แทน
              className="border-2 border-slate-500 bg-slate-700 cursor-pointer"
            />
          </button>

          {/* Dropdown Menu */}
          {isMenuOpen && (
            <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-2xl py-2 z-50 overflow-hidden border border-slate-200">
              <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Menu</div>
              
              <a href="/user" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors">My Profile</a>
              <a href="/trade-account" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors">TradeAccount</a>
              <a href="/EA" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors">EA Management</a>
              <a href="/Bill" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors">Billing</a>
              
              {isAdmin && (
                <>
                  <div className="border-t border-slate-100 my-1"></div>
                  <a href="/admin/setup" className="block px-4 py-2 text-sm text-indigo-600 font-bold hover:bg-indigo-50 transition-colors">
                    Admin
                  </a>
                </>
              )}
            </div>
          )}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-slate-700 text-white px-4 py-2 rounded-xl hover:bg-rose-600 transition-all"
        >
          <span className="text-xs font-bold">LOGOUT</span>
        </button>
      </div>
      
      {/* Background overlay เพื่อปิดเมนูเมื่อคลิกข้างนอก */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)}></div>
      )}
    </nav>
  )
}