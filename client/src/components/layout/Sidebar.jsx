// client/src/components/layout/Sidebar.jsx
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

const navItems = [
  { icon: "⊞", label: "Dashboard", path: "/dashboard" },
  { icon: "🔍", label: "Job Search", path: "/jobs" },
  { icon: "📋", label: "Applications", path: "/applications" },
  { icon: "📄", label: "Resume", path: "/resume" },
  { icon: "📊", label: "Analytics", path: "/analytics" },
  { icon: "👤", label: "Profile", path: "/profile" },
  { icon: "⚙️", label: "Settings", path: "/settings" },
]

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    navigate("/")
  }

  return (
    <aside className="w-[156px] min-h-screen bg-[#0D1321] border-r border-white/5 flex flex-col fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="p-4 border-b border-white/5">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#00D4AA]/20 flex items-center justify-center">
            <span className="text-[#00D4AA] text-sm">🚀</span>
          </div>
          <div>
            <p className="text-white text-xs font-bold leading-none">SmartHire</p>
            <p className="text-[#00D4AA] text-[9px] leading-none mt-0.5">AI TALENT ENGINE</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs transition ${
                isActive
                  ? "bg-[#00D4AA]/15 text-[#00D4AA] font-medium"
                  : "text-[#94A3B8] hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="text-sm">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="p-2 border-t border-white/5 space-y-1">
        <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs text-[#94A3B8] hover:text-white hover:bg-white/5 transition">
          <span>❓</span> Help
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs text-[#94A3B8] hover:text-[#FF4D6D] hover:bg-[#FF4D6D]/5 transition"
        >
          <span>↪</span> Sign Out
        </button>
      </div>
    </aside>
  )
}