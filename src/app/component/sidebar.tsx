"use client"

import { useRouter, usePathname } from "next/navigation"

type SidebarItemProps = {
  label: string
  href: string
}

export default function SidebarItem({ label, href }: SidebarItemProps) {
  const router = useRouter()
  const pathname = usePathname()

  const isActive = pathname === href

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    router.push(href)
  }

  return (
    <div
      onClick={handleClick}
      className={`
        px-6 py-4 cursor-pointer transition-all group
        ${isActive
          ? "bg-slate-800/50 text-blue-400 border-l-4 border-blue-500 font-bold"
          : "text-slate-400 hover:bg-slate-700/30 hover:text-white"}
      `}
    >
      <span
        className={`
          text-sm tracking-tight transition-transform inline-block
          ${isActive ? "translate-x-1" : "group-hover:translate-x-1"}
        `}
      >
        {label}
      </span>
    </div>
  )
}
