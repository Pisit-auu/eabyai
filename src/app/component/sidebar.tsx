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
    <a
      href={href}
      onClick={handleClick}
      aria-current={isActive ? "page" : undefined}
      className={`
        mx-3 my-0.5 px-3 py-2 rounded-md text-sm transition-colors block
        ${isActive
          ? "bg-slate-100 text-slate-900 font-medium"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}
      `}
    >
      {label.trim()}
    </a>
  )
}
