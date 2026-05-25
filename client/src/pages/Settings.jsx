// client/src/pages/Settings.jsx
import { useState, useEffect } from "react"
import api from '../services/api' 
import DashboardLayout from "../components/layout/DashboardLayout"
import { useAuth } from "../context/AuthContext"

export default function Settings() {
  const { user } = useAuth()

  const [digestEnabled, setDigestEnabled] = useState(true)
  const [settingsSaved, setSettingsSaved] = useState(false)

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordMsg, setPasswordMsg] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [passwordLoading, setPasswordLoading] = useState(false)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/api/profile" )
        const p = res.data.profile
        setDigestEnabled(p.digestEnabled !== false)
      } catch (err) {
        console.error("Settings fetch error:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleSaveNotifications = async () => {
    try {
      await api.patch("/api/profile/settings" ,{ digestEnabled } )
      setSettingsSaved(true)
      setTimeout(() => setSettingsSaved(false), 3000)
    } catch (err) {
      console.error("Save settings error:", err)
    }
  }

  const handleChangePassword = async () => {
    setPasswordMsg("")
    setPasswordError("")

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All fields are required")
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match")
      return
    }
    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters")
      return
    }

    setPasswordLoading(true)
    try {
      await api.post(
        "/api/auth/change-password",
        { currentPassword, newPassword },
        
      )
      setPasswordMsg("Password changed successfully")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err) {
      setPasswordError(err.response?.data?.message || "Failed to change password")
    } finally {
      setPasswordLoading(false)
    }
  }

  return (
    <DashboardLayout title="Settings">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white text-2xl font-bold">Settings</h2>
          <p className="text-[#94A3B8] text-sm">Manage your account preferences.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64 text-[#94A3B8]">Loading...</div>
      ) : (
        <div className="max-w-2xl space-y-4">

          {/* Account Info */}
          <div className="bg-[#111827] border border-white/10 rounded-xl p-6">
            <p className="text-[#00D4AA] text-[10px] font-bold tracking-widest mb-4">● ACCOUNT</p>
            <div className="space-y-3">
              <div>
                <p className="text-[#94A3B8] text-xs mb-1">Full Name</p>
                <div className="bg-[#0D1321] border border-white/10 rounded-lg px-4 py-2.5">
                  <p className="text-white text-sm">{user?.fullName || "—"}</p>
                </div>
              </div>
              <div>
                <p className="text-[#94A3B8] text-xs mb-1">Email Address</p>
                <div className="bg-[#0D1321] border border-white/10 rounded-lg px-4 py-2.5">
                  <p className="text-white text-sm">{user?.email || "—"}</p>
                </div>
              </div>
              <p className="text-[#4B5563] text-[10px]">
                To update your name or email, go to{" "}
                <a href="/profile" className="text-[#00D4AA] hover:underline">Profile page</a>.
              </p>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-[#111827] border border-white/10 rounded-xl p-6">
            <p className="text-[#00D4AA] text-[10px] font-bold tracking-widest mb-4">● NOTIFICATIONS</p>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-white text-sm font-semibold mb-1">Daily Job Digest Email</p>
                <p className="text-[#94A3B8] text-xs leading-relaxed">
                  Receive your top 5 AI-matched job opportunities every morning at 8 AM.
                  Turn this off to stop receiving daily digest emails.
                </p>
              </div>
              {/* Toggle */}
              <button
                onClick={() => setDigestEnabled(!digestEnabled)}
                className={`relative flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-200 ${
                  digestEnabled ? "bg-[#00D4AA]" : "bg-white/10"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                    digestEnabled ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-[#4B5563] text-[10px]">
                Status:{" "}
                <span className={digestEnabled ? "text-[#00D4AA]" : "text-[#FF4D6D]"}>
                  {digestEnabled ? "Enabled — agent runs daily at 8:00 AM" : "Disabled — no digest emails will be sent"}
                </span>
              </p>
              <button
                onClick={handleSaveNotifications}
                className="bg-gradient-to-r from-[#00D4AA] to-[#0099FF] text-white text-xs font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition"
              >
                {settingsSaved ? "✓ Saved" : "Save"}
              </button>
            </div>
          </div>

          {/* Change Password */}
          <div className="bg-[#111827] border border-white/10 rounded-xl p-6">
            <p className="text-[#00D4AA] text-[10px] font-bold tracking-widest mb-4">● CHANGE PASSWORD</p>
            <div className="space-y-3">
              <div>
                <p className="text-[#94A3B8] text-xs mb-1">Current Password</p>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full bg-[#0D1321] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder-[#4B5563] focus:outline-none focus:border-[#00D4AA]/50"
                />
              </div>
              <div>
                <p className="text-[#94A3B8] text-xs mb-1">New Password</p>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full bg-[#0D1321] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder-[#4B5563] focus:outline-none focus:border-[#00D4AA]/50"
                />
              </div>
              <div>
                <p className="text-[#94A3B8] text-xs mb-1">Confirm New Password</p>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full bg-[#0D1321] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder-[#4B5563] focus:outline-none focus:border-[#00D4AA]/50"
                />
              </div>

              {passwordError && (
                <div className="bg-[#FF4D6D]/10 border border-[#FF4D6D]/20 rounded-lg px-3 py-2">
                  <p className="text-[#FF4D6D] text-xs">{passwordError}</p>
                </div>
              )}
              {passwordMsg && (
                <div className="bg-[#00D4AA]/10 border border-[#00D4AA]/20 rounded-lg px-3 py-2">
                  <p className="text-[#00D4AA] text-xs">✓ {passwordMsg}</p>
                </div>
              )}

              <button
                onClick={handleChangePassword}
                disabled={passwordLoading}
                className="bg-gradient-to-r from-[#00D4AA] to-[#0099FF] text-white text-xs font-semibold px-5 py-2.5 rounded-lg hover:opacity-90 transition disabled:opacity-50"
              >
                {passwordLoading ? "Changing..." : "Change Password"}
              </button>
            </div>
          </div>

        </div>
      )}
    </DashboardLayout>
  )
}