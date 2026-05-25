// client/src/pages/Dashboard.jsx
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import api from '../services/api' 
import DashboardLayout from "../components/layout/DashboardLayout"

const STATUS_COLORS = {
  Saved: "#0099FF",
  Applied: "#00D4AA",
  Interview: "#FFB800",
  Offer: "#00D4AA",
  Rejected: "#FF4D6D",
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, jobsRes] = await Promise.all([
          api.get("/api/profile" ),
          api.get("/api/saved-jobs" ),
        ])
        setProfile(profileRes.data.profile || profileRes.data)
        setJobs(jobsRes.data.savedJobs || [])
      } catch (err) {
        console.error("Dashboard fetch error:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // --- Derived stats ---
  const totalSaved = jobs.length
  const totalApplied = jobs.filter((j) => j.status === "Applied").length
  const interviews = jobs.filter((j) => j.status === "Interview").length
  const offers = jobs.filter((j) => j.status === "Offer").length
  const atsScore = profile?.atsScore || 0
  const atsPercentile = atsScore >= 90 ? "Top 5%" : atsScore >= 75 ? "Top 20%" : atsScore >= 60 ? "Top 40%" : ""

  // Recent 5 jobs (mix of applied + saved, sorted by savedAt desc)
  const recentJobs = [...jobs]
    .sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt))
    .slice(0, 5)

  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return ""
    const diff = Date.now() - new Date(dateStr).getTime()
    const hours = Math.floor(diff / 3600000)
    if (hours < 1) return "Just now"
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    if (days === 1) return "Yesterday"
    return `${days}d ago`
  }

  const stats = [
    {
      label: "TOTAL SAVED",
      value: loading ? "—" : totalSaved,
      change: `${totalApplied} applied`,
      sub: "Jobs saved to tracker",
      icon: "🔖",
      color: "#00D4AA",
    },
    {
      label: "INTERVIEWS",
      value: loading ? "—" : interviews,
      change: offers > 0 ? `${offers} offer${offers > 1 ? "s" : ""}` : "Keep going!",
      sub: "Active interview stages",
      icon: "📅",
      color: "#0099FF",
    },
    {
      label: "APPLIED",
      value: loading ? "—" : totalApplied,
      change: totalSaved > 0 ? `${Math.round((totalApplied / totalSaved) * 100)}% conversion` : "0%",
      sub: "From saved to applied",
      icon: "✅",
      color: "#FFB800",
    },
  ]

  return (
    <DashboardLayout title="Dashboard">
      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-[#111827] border border-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[#94A3B8] text-[10px] font-medium tracking-wide">{stat.label}</p>
              <span className="text-sm">{stat.icon}</span>
            </div>
            <div className="flex items-end gap-2">
              <p className="text-white text-3xl font-bold">{stat.value}</p>
              <span className="text-xs mb-1" style={{ color: stat.color }}>
                {stat.change}
              </span>
            </div>
            {stat.sub && <p className="text-[#94A3B8] text-xs mt-1">{stat.sub}</p>}
          </div>
        ))}

        {/* ATS Score */}
        <div className="bg-[#111827] border border-white/10 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-[#94A3B8] text-[10px] font-medium tracking-wide mb-1">ATS SCORE</p>
            {loading ? (
              <p className="text-[#94A3B8] text-2xl font-bold">—</p>
            ) : atsScore > 0 ? (
              <>
                <p className="text-[#00D4AA] text-3xl font-bold">
                  {atsScore}
                  <span className="text-sm text-[#94A3B8]">/100</span>
                </p>
                {atsPercentile && (
                  <p className="text-[#00D4AA] text-xs mt-1">{atsPercentile}</p>
                )}
              </>
            ) : (
              <div>
                <p className="text-[#94A3B8] text-sm mt-1">Not analyzed</p>
                <button
                  onClick={() => navigate("/resume")}
                  className="text-[#00D4AA] text-[10px] mt-1 hover:underline"
                >
                  Analyze Resume →
                </button>
              </div>
            )}
          </div>
          <div className="w-14 h-14 rounded-full border-4 border-[#00D4AA]/30 flex items-center justify-center">
            <span className="text-[#00D4AA] text-lg">🎯</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Recent Activity — real jobs */}
        <div className="col-span-2 bg-[#111827] border border-white/10 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold text-sm">Recent Activity</h2>
            <button
              onClick={() => navigate("/applications")}
              className="text-[#00D4AA] text-xs hover:underline"
            >
              View All →
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8 text-[#94A3B8] text-xs">Loading...</div>
          ) : recentJobs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[#94A3B8] text-sm">No activity yet.</p>
              <button
                onClick={() => navigate("/jobs")}
                className="mt-2 text-[#00D4AA] text-xs hover:underline"
              >
                Search & Save Jobs →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentJobs.map((job) => {
                const color = STATUS_COLORS[job.status] || "#00D4AA"
                const icon =
                  job.status === "Applied"
                    ? "✅"
                    : job.status === "Interview"
                    ? "📅"
                    : job.status === "Offer"
                    ? "🎉"
                    : job.status === "Rejected"
                    ? "❌"
                    : "🔖"

                return (
                  <div key={job.jobId} className="flex gap-3 p-3 bg-[#0D1321] rounded-xl">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm"
                      style={{ backgroundColor: `${color}20` }}
                    >
                      {icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <p className="text-white text-xs font-semibold truncate">{job.title}</p>
                        <span className="text-[#94A3B8] text-[10px] ml-2 flex-shrink-0">
                          {formatTimeAgo(job.savedAt)}
                        </span>
                      </div>
                      <p className="text-[#94A3B8] text-xs mb-1.5">
                        {job.company}
                        {job.location ? ` · ${job.location}` : ""}
                      </p>
                      <div className="flex items-center gap-2">
                        <span
                          className="text-[9px] font-semibold px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: `${color}20`, color }}
                        >
                          {job.status.toUpperCase()}
                        </span>
                        {job.matchScore > 0 && (
                          <span className="bg-[#00D4AA]/10 text-[#00D4AA] text-[9px] px-2 py-0.5 rounded-full">
                            AI Match: {job.matchScore}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div className="space-y-4">
          {/* Status breakdown */}
          <div className="bg-[#111827] border border-white/10 rounded-xl p-4">
            <p className="text-[#00D4AA] text-[10px] font-bold tracking-widest mb-3">
              ● APPLICATION PIPELINE
            </p>
            {loading ? (
              <div className="text-[#94A3B8] text-xs text-center py-4">Loading...</div>
            ) : (
              <div className="space-y-2">
                {[
                  { label: "Saved", color: "#0099FF" },
                  { label: "Applied", color: "#00D4AA" },
                  { label: "Interview", color: "#FFB800" },
                  { label: "Offer", color: "#00D4AA" },
                  { label: "Rejected", color: "#FF4D6D" },
                ].map(({ label, color }) => {
                  const count = jobs.filter((j) => j.status === label).length
                  const pct = totalSaved > 0 ? Math.round((count / totalSaved) * 100) : 0
                  return (
                    <div key={label}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[#94A3B8] text-[10px]">{label}</span>
                        <span className="text-white text-[10px] font-semibold">{count}</span>
                      </div>
                      <div className="w-full h-1 bg-white/10 rounded-full">
                        <div
                          className="h-1 rounded-full transition-all"
                          style={{ width: `${pct}%`, backgroundColor: color }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* ATS Sub-scores */}
          <div className="bg-[#111827] border border-white/10 rounded-xl p-4">
            <p className="text-[#00D4AA] text-[10px] font-bold tracking-widest mb-3">
              ● RESUME SCORES
            </p>
            {loading ? (
              <div className="text-[#94A3B8] text-xs text-center py-4">Loading...</div>
            ) : profile?.atsScores && atsScore > 0 ? (
              <div className="space-y-2">
                {[
                  { label: "Keywords", key: "keywords" },
                  { label: "Formatting", key: "formatting" },
                  { label: "Readability", key: "readability" },
                  { label: "Skills Align", key: "skillsAlignment" },
                ].map(({ label, key }) => {
                  const val = profile.atsScores[key] || 0
                  return (
                    <div key={key}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[#94A3B8] text-[10px]">{label}</span>
                        <span className="text-white text-[10px] font-semibold">{val}/100</span>
                      </div>
                      <div className="w-full h-1 bg-white/10 rounded-full">
                        <div
                          className="h-1 rounded-full"
                          style={{
                            width: `${val}%`,
                            backgroundColor: val >= 80 ? "#00D4AA" : val >= 60 ? "#FFB800" : "#FF4D6D",
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-3">
                <p className="text-[#94A3B8] text-xs">No resume analyzed yet.</p>
                <button
                  onClick={() => navigate("/resume")}
                  className="text-[#00D4AA] text-[10px] mt-1 hover:underline"
                >
                  Go to Resume →
                </button>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="bg-[#111827] border border-white/10 rounded-xl p-4">
            <p className="text-[#00D4AA] text-[10px] font-bold tracking-widest mb-3">
              ● QUICK ACTIONS
            </p>
            <div className="space-y-2">
              {[
                { label: "Search Jobs", icon: "🔍", path: "/jobs" },
                { label: "View Applications", icon: "📋", path: "/applications" },
                { label: "Update Resume", icon: "📄", path: "/resume" },
                { label: "Edit Profile", icon: "👤", path: "/profile" },
              ].map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="w-full flex items-center gap-2 p-2 rounded-lg bg-[#0D1321] hover:bg-white/5 transition text-left"
                >
                  <span className="text-sm">{item.icon}</span>
                  <span className="text-[#94A3B8] text-xs hover:text-white">{item.label}</span>
                  <span className="text-[#94A3B8] text-xs ml-auto">›</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}