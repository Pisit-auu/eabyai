"use client"
import { useState } from 'react'
import { Avatar } from 'antd';
import { UserOutlined, MenuOutlined, LogoutOutlined } from '@ant-design/icons';
import Link from 'next/link';

type NavbarProps = {
  isSidebarOpen: boolean
  setSidebarOpen: (value: boolean) => void
  handleLogout: () => void
  isAdmin: boolean
  userImage?: string | null | undefined
}

const menuLinks = [
  { href: '/user', label: 'My Profile' },
  { href: '/trade-account', label: 'Trade Account' },
  { href: '/EA', label: 'Expert Advisor' },
  { href: '/Bill', label: 'Billing' },
]

export default function Navbar({
  isSidebarOpen,
  setSidebarOpen,
  handleLogout,
  isAdmin,
  userImage
}: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-white h-14 flex items-center justify-between px-4 md:px-6 border-b border-slate-200 z-30 relative shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          aria-label={isSidebarOpen ? 'Hide navigation' : 'Show navigation'}
          aria-expanded={isSidebarOpen}
          className="w-9 h-9 flex items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
        >
          <MenuOutlined />
        </button>
        <Link href={'/EA'} className="text-[17px] font-semibold tracking-tight text-slate-900">
          EA<span className="text-slate-400">.AI</span>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Account menu"
            aria-expanded={isMenuOpen}
            className="flex items-center justify-center rounded-full p-0.5 transition-shadow hover:ring-2 hover:ring-slate-200"
          >
            <Avatar
              size={32}
              src={userImage || undefined}
              icon={<UserOutlined />}
              className="!bg-slate-100 !text-slate-500 cursor-pointer"
            />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-1.5 z-50 border border-slate-200 animate-fadeIn">
              {menuLinks.map(link => (
                <a key={link.href} href={link.href} className="block px-3 py-2 mx-1.5 rounded-md text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors">
                  {link.label}
                </a>
              ))}

              {isAdmin && (
                <>
                  <div className="border-t border-slate-200 my-1.5"></div>
                  <a href="/admin/setup" className="block px-3 py-2 mx-1.5 rounded-md text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors">
                    Admin
                  </a>
                </>
              )}
            </div>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 h-9 px-3 rounded-md text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
        >
          <LogoutOutlined />
          <span className="hidden sm:inline">Log out</span>
        </button>
      </div>

      {isMenuOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)}></div>
      )}
    </nav>
  )
}
