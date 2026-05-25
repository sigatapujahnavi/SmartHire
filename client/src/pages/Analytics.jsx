// client/src/pages/Analytics.jsx
import { useState, useEffect } from "react"
import api from '../services/api' 
import DashboardLayout from "../components/layout/DashboardLayout"
import { useNavigate } from "react-router-dom"

export default function Analytics() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [jobs, setJobs] = useState([])
  const [digestGroups, setDigestGroups] = useState([])
  const [expandedDates, setExpandedDates] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, jobsRes, digestRes] = await Promise.all([
          api.get("/api/profile" ),
          api.get("/api/saved-jobs"),
          api.get("/api/digest/jobs" ),
        ])
        setProfile(profileRes.data.profile)
        setJobs(jobsRes.data.savedJobs || [])

        const groups = digestRes.data.digestGroups || []
        setDigestGroups(groups)

        // Today expanded by default, rest collapsed
        const expanded = {}
        groups.forEach((g, i) => { expanded[g.date] = i === 0 })
        setExpandedDates(expanded)
      } catch (err) {
        console.error("Analytics fetch error:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const toggleDate = (date) => {
    setExpandedDates(prev => ({ ...prev, [date]: !prev[date] }))
  }

  // Derived stats
  const atsScore = profile?.atsScore || 0
  const atsScores = profile?.atsScores || {}
  const topSkills = profile?.atsTopSkillsFound || []
  const recommendations = profile?.atsRecommendations || []

  const statusCounts = {
    Saved: jobs.filter((j) => j.status === "Saved").length,
    Applied: jobs.filter((j) => j.status === "Applied").length,
    Interview: jobs.filter((j) => j.status === "Interview").length,
    Offer: jobs.filter((j) => j.status === "Offer").length,
    Rejected: jobs.filter((j) => j.status === "Rejected").length,
  }

  const totalJobs = jobs.length
  const scoredJobs = jobs.filter((j) => j.matchScore > 0)
  const avgMatchScore =
    scoredJobs.length > 0
      ? Math.round(scoredJobs.reduce((sum, j) => sum + j.matchScore, 0) / scoredJobs.length)
      : 0
  const highMatchJobs = scoredJobs.filter((j) => j.matchScore >= 80).length

  const getScoreColor = (score) => {
    if (score >= 80) return "#00D4AA"
    if (score >= 60) return "#FFB800"
    return "#FF4D6D"
  }

  const STATUS_COLORS = {
    Saved: "#0099FF",
    Applied: "#00D4AA",
    Interview: "#FFB800",
    Offer: "#00D4AA",
    Rejected: "#FF4D6D",
  }

  // Format date label: "Today", "Yesterday", or "May 22"
  const formatDateLabel = (dateStr) => {
    const today = new Date().toISOString().split("T")[0]
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0]
    if (dateStr === today) return "Today"
    if (dateStr === yesterday) return "Yesterday"
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  // Next 8 AM calculation
  const getNextRunLabel = () => {
    const now = new Date()
    const next = new Date()
    next.setHours(8, 0, 0, 0)
    if (now.getHours() >= 8) next.setDate(next.getDate() + 1)
    const diff = next - now
    const hours = Math.floor(diff / 3600000)
    const mins = Math.floor((diff % 3600000) / 60000)
    return hours > 0 ? `in ${hours}h ${mins}m` : `in ${mins}m`
  }

  const lastRanDate = digestGroups[0]?.date
  const lastRanLabel = lastRanDate ? formatDateLabel(lastRanDate) : null

  return (
    <DashboardLayout title="AI Insights">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white text-2xl font-bold">AI Insights</h2>
          <p className="text-[#94A3B8] text-sm">
            Real data from your resume, saved jobs, and AI analysis.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64 text-[#94A3B8]">
          Loading insights...
        </div>
      ) : (
        <div className="space-y-4">

          {/* ── Daily Digest Agent Card ── */}
          <div className="bg-gradient-to-r from-[#00D4AA]/10 to-[#0099FF]/10 border border-[#00D4AA]/30 rounded-xl p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">⚡</span>
                  <p className="text-white font-bold text-base">Daily Job Digest Agent</p>
                  <span className="bg-[#00D4AA]/20 text-[#00D4AA] text-[9px] font-bold px-2 py-0.5 rounded-full tracking-widest">
                    AI AGENT
                  </span>
                </div>
                <p className="text-[#94A3B8] text-xs mb-4">
                  Runs autonomously every morning at 8 AM — fetches live jobs matching your profile,
                  AI-scores each one against your resume, and delivers your top 5 matches by email.
                  No action needed from you.
                </p>

                {/* Agent Status Row */}
                <div className="flex items-center gap-6">
                  {/* Status */}
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00D4AA] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00D4AA]"></span>
                    </span>
                    <span className="text-[#00D4AA] text-xs font-semibold">Agent Active</span>
                  </div>

                  {/* Last ran */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#4B5563] text-xs">Last ran:</span>
                    <span className="text-white text-xs font-medium">
                      {lastRanLabel ? `${lastRanLabel} at 8:00 AM` : "Not yet run"}
                    </span>
                  </div>

                  {/* Next run */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#4B5563] text-xs">Next run:</span>
                    <span className="text-white text-xs font-medium">{getNextRunLabel()}</span>
                  </div>

                  {/* Jobs delivered */}
                  {digestGroups[0] && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#4B5563] text-xs">Today's matches:</span>
                      <span className="text-[#00D4AA] text-xs font-bold">{digestGroups[0].jobs.length} jobs</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Readiness check */}
            <div className="border-t border-white/10 mt-4 pt-3 flex items-center gap-6">
              <div className="flex items-center gap-1.5">
                <span className={profile?.resumeUrl ? "text-[#00D4AA]" : "text-[#FF4D6D]"}>
                  {profile?.resumeUrl ? "✓" : "✗"}
                </span>
                <span className="text-[#94A3B8] text-[10px]">Resume uploaded</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={profile?.desiredTitles?.length > 0 ? "text-[#00D4AA]" : "text-[#FF4D6D]"}>
                  {profile?.desiredTitles?.length > 0 ? "✓" : "✗"}
                </span>
                <span className="text-[#94A3B8] text-[10px]">Desired titles set</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={profile?.preferredLocations?.length > 0 ? "text-[#00D4AA]" : "text-[#FFB800]"}>
                  {profile?.preferredLocations?.length > 0 ? "✓" : "○"}
                </span>
                <span className="text-[#94A3B8] text-[10px]">Locations (optional)</span>
              </div>
              <p className="text-[#4B5563] text-[10px] ml-auto">
                Powered by Groq LLaMA 3.3 + JSearch API
              </p>
            </div>
          </div>

          {/* ── Digest Jobs Timeline ── */}
          <div className="bg-[#111827] border border-white/10 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <p className="text-[#00D4AA] text-[10px] font-bold tracking-widest">● DIGEST JOB MATCHES</p>
                <span className="text-[#4B5563] text-[10px]">Last 3 days</span>
              </div>
              {digestGroups.length > 0 && (
                <span className="text-[#4B5563] text-[10px]">
                  {digestGroups.reduce((sum, g) => sum + g.jobs.length, 0)} total jobs
                </span>
              )}
            </div>

            {digestGroups.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-3xl mb-3">⚡</p>
                <p className="text-white text-sm font-semibold mb-1">Agent hasn't run yet</p>
                <p className="text-[#94A3B8] text-xs">
                  Your first digest will arrive tomorrow at 8:00 AM.
                  {(!profile?.resumeUrl || !profile?.desiredTitles?.length) && (
                    <span> Make sure to{" "}
                      <button onClick={() => navigate("/profile")} className="text-[#00D4AA] underline">
                        complete your profile
                      </button>{" "}first.
                    </span>
                  )}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {digestGroups.map((group) => {
                  const isToday = group.date === new Date().toISOString().split("T")[0]
                  const isExpanded = expandedDates[group.date]
                  const label = formatDateLabel(group.date)

                  return (
                    <div key={group.date}>
                      {/* Date header — clickable to collapse/expand */}
                      <button
                        onClick={() => toggleDate(group.date)}
                        className="w-full px-5 py-3 flex items-center justify-between hover:bg-white/5 transition"
                      >
                        <div className="flex items-center gap-3">
                          {isToday && (
                            <span className="relative flex h-1.5 w-1.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00D4AA] opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#00D4AA]"></span>
                            </span>
                          )}
                          <span className={`text-sm font-semibold ${isToday ? "text-white" : "text-[#94A3B8]"}`}>
                            {label}
                          </span>
                          <span className="text-[#4B5563] text-[10px]">
                            {group.jobs.length} matches · {group.date}
                          </span>
                        </div>
                        <span className="text-[#4B5563] text-xs">{isExpanded ? "▲" : "▼"}</span>
                      </button>

                      {/* Job cards */}
                      {isExpanded && (
                        <div className="px-5 pb-4 space-y-3">
                          {group.jobs.map((job) => (
                            <div
                              key={job._id}
                              className="bg-[#0D1321] border border-white/5 rounded-xl p-4 flex items-center justify-between gap-4"
                            >
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                {/* Logo */}
                                <div className="w-9 h-9 rounded-lg bg-[#1a2332] flex items-center justify-center flex-shrink-0 overflow-hidden">
                                  {job.logo ? (
                                    <img src={job.logo} alt={job.company} className="w-full h-full object-contain p-1" />
                                  ) : (
                                    <span className="text-white text-xs font-bold">
                                      {job.company?.[0] || "?"}
                                    </span>
                                  )}
                                </div>
                                {/* Info */}
                                <div className="min-w-0">
                                  <p className="text-white text-sm font-semibold truncate">{job.title}</p>
                                  <p className="text-[#94A3B8] text-xs truncate">
                                    {job.company} · {job.location}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[#4B5563] text-[10px] bg-white/5 px-2 py-0.5 rounded">{job.type}</span>
                                    <span className="text-[#4B5563] text-[10px] bg-white/5 px-2 py-0.5 rounded">{job.salary}</span>
                                    {job.isRemote && (
                                      <span className="text-[#0099FF] text-[10px] bg-[#0099FF]/10 px-2 py-0.5 rounded">Remote</span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Score + Apply */}
                              <div className="flex items-center gap-3 flex-shrink-0">
                                <div className="text-right">
                                  <p
                                    className="text-lg font-bold"
                                    style={{ color: getScoreColor(job.matchScore) }}
                                  >
                                    {job.matchScore}%
                                  </p>
                                  <p className="text-[#4B5563] text-[9px]">match</p>
                                </div>
                                <a
                                  href={job.applyLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="bg-gradient-to-r from-[#00D4AA] to-[#0099FF] text-white text-[10px] font-bold px-4 py-2 rounded-lg hover:opacity-90 transition whitespace-nowrap"
                                >
                                  Apply Now →
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* ── 3 Stats Cards ── */}
          <div className="grid grid-cols-3 gap-4">
            {/* ATS Score */}
            <div className="bg-[#111827] border border-white/10 rounded-xl p-5">
              <p className="text-[#00D4AA] text-[10px] font-bold tracking-widest mb-4">● RESUME ATS SCORE</p>
              {atsScore > 0 ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-4xl font-bold" style={{ color: getScoreColor(atsScore) }}>
                      {atsScore}<span className="text-sm text-[#94A3B8]">/100</span>
                    </p>
                    <div className="w-14 h-14 rounded-full border-4 flex items-center justify-center"
                      style={{ borderColor: `${getScoreColor(atsScore)}40` }}>
                      <span className="text-xl">🎯</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {[
                      { label: "Keywords", key: "keywords" },
                      { label: "Formatting", key: "formatting" },
                      { label: "Readability", key: "readability" },
                      { label: "Skills Align", key: "skillsAlignment" },
                    ].map(({ label, key }) => {
                      const val = atsScores[key] || 0
                      return (
                        <div key={key}>
                          <div className="flex justify-between mb-0.5">
                            <span className="text-[#94A3B8] text-[10px]">{label}</span>
                            <span className="text-white text-[10px]">{val}</span>
                          </div>
                          <div className="h-1 bg-white/10 rounded-full">
                            <div className="h-1 rounded-full" style={{ width: `${val}%`, backgroundColor: getScoreColor(val) }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </>
              ) : (
                <div className="text-center py-6">
                  <p className="text-[#94A3B8] text-xs mb-2">No ATS analysis yet</p>
                  <button onClick={() => navigate("/resume")} className="text-[#00D4AA] text-xs hover:underline">
                    Analyze Resume →
                  </button>
                </div>
              )}
            </div>

            {/* Pipeline */}
            <div className="bg-[#111827] border border-white/10 rounded-xl p-5">
              <p className="text-[#00D4AA] text-[10px] font-bold tracking-widest mb-4">● APPLICATION PIPELINE</p>
              {totalJobs > 0 ? (
                <>
                  <div className="flex items-end gap-2 mb-4">
                    <p className="text-white text-4xl font-bold">{totalJobs}</p>
                    <p className="text-[#94A3B8] text-xs mb-1">total saved</p>
                  </div>
                  <div className="space-y-2">
                    {Object.entries(statusCounts).map(([status, count]) => {
                      const pct = totalJobs > 0 ? Math.round((count / totalJobs) * 100) : 0
                      return (
                        <div key={status}>
                          <div className="flex justify-between mb-0.5">
                            <span className="text-[#94A3B8] text-[10px]">{status}</span>
                            <span className="text-white text-[10px]">{count}<span className="text-[#4B5563]"> ({pct}%)</span></span>
                          </div>
                          <div className="h-1 bg-white/10 rounded-full">
                            <div className="h-1 rounded-full" style={{ width: `${pct}%`, backgroundColor: STATUS_COLORS[status] }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </>
              ) : (
                <div className="text-center py-6">
                  <p className="text-[#94A3B8] text-xs mb-2">No saved jobs yet</p>
                  <button onClick={() => navigate("/jobs")} className="text-[#00D4AA] text-xs hover:underline">Search Jobs →</button>
                </div>
              )}
            </div>

            {/* AI Match Stats */}
            <div className="bg-[#111827] border border-white/10 rounded-xl p-5">
              <p className="text-[#00D4AA] text-[10px] font-bold tracking-widest mb-4">● AI MATCH STATS</p>
              {scoredJobs.length > 0 ? (
                <>
                  <div className="mb-4">
                    <p className="text-[#94A3B8] text-[10px] mb-1">AVG MATCH SCORE</p>
                    <p className="text-4xl font-bold" style={{ color: getScoreColor(avgMatchScore) }}>
                      {avgMatchScore}<span className="text-sm text-[#94A3B8]">%</span>
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-[#0D1321] rounded-lg p-3 flex items-center justify-between">
                      <p className="text-[#94A3B8] text-xs">Jobs scored</p>
                      <p className="text-white text-xs font-bold">{scoredJobs.length}</p>
                    </div>
                    <div className="bg-[#0D1321] rounded-lg p-3 flex items-center justify-between">
                      <p className="text-[#94A3B8] text-xs">High matches (80%+)</p>
                      <p className="text-[#00D4AA] text-xs font-bold">{highMatchJobs}</p>
                    </div>
                    <div className="bg-[#0D1321] rounded-lg p-3 flex items-center justify-between">
                      <p className="text-[#94A3B8] text-xs">Best match</p>
                      <p className="text-[#00D4AA] text-xs font-bold">{Math.max(...scoredJobs.map((j) => j.matchScore))}%</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-6">
                  <p className="text-[#94A3B8] text-xs mb-2">No AI scores yet</p>
                  <button onClick={() => navigate("/jobs")} className="text-[#00D4AA] text-xs hover:underline">Calculate Match Scores →</button>
                </div>
              )}
            </div>
          </div>

          {/* ── Skills + Recommendations ── */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#111827] border border-white/10 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[#00D4AA] text-[10px] font-bold tracking-widest">● SKILLS DETECTED FROM RESUME</p>
                <span className="text-[#4B5563] text-[10px]">{topSkills.length} skills</span>
              </div>
              {topSkills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {topSkills.map((skill) => (
                    <span key={skill} className="bg-[#00D4AA]/10 border border-[#00D4AA]/20 text-[#00D4AA] text-[10px] px-2.5 py-1 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-[#94A3B8] text-xs">Analyze your resume to detect skills automatically.</p>
                </div>
              )}
            </div>

            <div className="bg-[#111827] border border-white/10 rounded-xl p-5">
              <p className="text-[#00D4AA] text-[10px] font-bold tracking-widest mb-3">● AI RESUME RECOMMENDATIONS</p>
              {recommendations.length > 0 ? (
                <div className="space-y-3">
                  {recommendations.map((rec, i) => (
                    <div key={i} className="flex gap-3 p-3 bg-[#0D1321] rounded-xl">
                      <span className="text-base flex-shrink-0">{rec.icon}</span>
                      <div>
                        <p className="text-white text-xs font-semibold mb-0.5">{rec.title}</p>
                        <p className="text-[#94A3B8] text-[10px] leading-relaxed">{rec.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-[#94A3B8] text-xs mb-2">No recommendations yet.</p>
                  <button onClick={() => navigate("/resume")} className="text-[#00D4AA] text-xs hover:underline">Analyze Resume →</button>
                </div>
              )}
            </div>
          </div>

        </div>
      )}
    </DashboardLayout>
  )
}