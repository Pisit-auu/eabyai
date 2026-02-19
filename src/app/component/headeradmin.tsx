"use client"

type NavbarProps = {
  isSidebarOpen: boolean
  setSidebarOpen: (value: boolean) => void
  handleLogout: () => void
}

export default function Navbar({
  isSidebarOpen,
  setSidebarOpen,
  handleLogout,
}: NavbarProps) {
  return (
    <nav className="bg-[#1E293B] h-20 flex items-center justify-between px-8 shadow-xl z-30">
      <div className="flex items-center gap-6">
        <button
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="text-white hover:bg-slate-700 p-2 rounded-xl transition-all"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <span className="text-4xl font-black text-white italic tracking-tighter">
          EA Admin
        </span>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 bg-slate-700 text-white px-4 py-2 rounded-xl hover:bg-rose-600 transition-all"
      >
        <span className="text-xs font-bold">LOGOUT</span>
      </button>
    </nav>
  )
}
