// client/src/components/layout/TopBar.jsx
import { useAuth } from "../../context/AuthContext"
import { useEffect, useState } from "react"
import api from "../../services/api"

export default function TopBar({ title }) {
  const { user } = useAuth()
const [avatarUrl, setAvatarUrl] = useState("")
  const [professionalTitle, setProfessionalTitle] = useState("")

  useEffect(() => {
    api.get("/api/profile" )
      .then(res => {
        setAvatarUrl(res.data.profile?.avatarUrl || "")
        setProfessionalTitle(res.data.profile?.professionalTitle || "")
      })
      .catch(() => {})
  }, [])

  return (
    <header className="h-14 bg-[#0D1321] border-b border-white/5 flex items-center justify-between px-6 fixed top-0 right-0 left-[156px] z-30">
      <div className="flex items-center gap-4">
        <h1 className="text-white font-semibold text-sm">{title}</h1>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] text-xs">🔍</span>
          <input
            type="text"
            placeholder="Search applications, skills, or mentors..."
            className="bg-white/5 border border-white/10 text-white text-xs placeholder-[#4B5563] rounded-lg py-2 pl-8 pr-4 w-64 focus:outline-none focus:border-[#00D4AA] transition"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#94A3B8] hover:text-white transition">
          🔔
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF4D6D] rounded-full text-white text-[9px] flex items-center justify-center">3</span>
        </button>
        <div className="flex items-center gap-2">
         <div className="w-8 h-8 rounded-full bg-[#00D4AA]/20 flex items-center justify-center text-[#00D4AA] text-xs font-bold overflow-hidden">
            {avatarUrl
              ? <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
              : user?.fullName?.charAt(0) || "U"
            }
          </div>
          <div>
            <p className="text-white text-xs font-semibold leading-none">{user?.fullName || "User"}</p>
           <p className="text-[#94A3B8] text-[10px] leading-none mt-0.5">{professionalTitle || "Add your title"}</p>
          </div>
        </div>
      </div>
    </header>
  )
}