import { useState, useEffect } from "react"
import api from '../services/api' 
import DashboardLayout from "../components/layout/DashboardLayout"

const JOB_TYPES = ["", "FULLTIME", "PARTTIME", "CONTRACTOR", "INTERN"]
const JOB_TYPE_LABELS = {
  "": "All Types",
  FULLTIME: "Full Time",
  PARTTIME: "Part Time",
  CONTRACTOR: "Contract",
  INTERN: "Internship",
}

const DATE_POSTED_OPTIONS = [
  { value: "", label: "Any Time" },
  { value: "3days", label: "Last 3 Days" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
]

const EXPERIENCE_LEVELS = [
  { value: "", label: "All Levels" },
  { value: "entry", label: "Entry Level", keywords: ["entry", "junior", "fresher", "graduate", "0-1", "0-2"] },
  { value: "mid", label: "Mid Level", keywords: ["mid", "2-4", "2-5", "3-5", "intermediate"] },
  { value: "senior", label: "Senior Level", keywords: ["senior", "lead", "principal", "5+", "staff"] },
]

export default function JobSearch() {
  const [jobs, setJobs] = useState([])
  const [filteredJobs, setFilteredJobs] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [query, setQuery] = useState("")
  const [location, setLocation] = useState("")
  const [type, setType] = useState("")
  const [page, setPage] = useState(1)
  const [searched, setSearched] = useState(true)
  const [matchLoading, setMatchLoading] = useState(false)
  const [matchData, setMatchData] = useState(null)
  const [matchError, setMatchError] = useState("")

  // Filter states
  const [datePosted, setDatePosted] = useState("")
  const [remoteOnly, setRemoteOnly] = useState(false)
  const [experienceLevel, setExperienceLevel] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  // Save job states
  const [savedJobIds, setSavedJobIds] = useState({}) // { jobId: { status, matchScore } }
  const [saveLoading, setSaveLoading] = useState({})
  const [appliedJobs, setAppliedJobs] = useState({}) // { jobId: true }

  // Cover letter states
  const [coverLetterModal, setCoverLetterModal] = useState(false)
  const [coverLetterLoading, setCoverLetterLoading] = useState(false)
  const [coverLetterText, setCoverLetterText] = useState("")
  const [coverLetterError, setCoverLetterError] = useState("")
const [copied, setCopied] = useState(false)

  // Resume tailoring states
  const [tailorModal, setTailorModal] = useState(false)
  const [tailorLoading, setTailorLoading] = useState(false)
  const [tailorData, setTailorData] = useState(null)
  const [tailorError, setTailorError] = useState("")

  // Fetch saved job IDs on mount
  useEffect(() => {
    const fetchSavedIds = async () => {
      try {
        const res = await api.get("/api/saved-jobs/ids" )
        const map = {}
        res.data.savedJobs.forEach(j => {
          map[j.jobId] = { status: j.status, matchScore: j.matchScore }
        })
        setSavedJobIds(map)
        // Mark applied jobs
        const applied = {}
        res.data.savedJobs.forEach(j => {
          if (j.status === 'Applied' || j.status === 'Interview' || j.status === 'Offer') {
            applied[j.jobId] = true
          }
        })
        setAppliedJobs(applied)
      } catch (err) {
        console.error('Failed to fetch saved job ids')
      }
    }
    fetchSavedIds()
  }, [])

  const fetchJobs = async (resetPage = false) => {
    try {
      setLoading(true)
      setError("")
      const currentPage = resetPage ? 1 : page
      if (resetPage) setPage(1)

      const res = await api.get("/api/jobs/search", {
        params: {
          query: query || "developer",
          location,
          type,
          page: currentPage,
          datePosted,
          remoteOnly: remoteOnly ? "true" : "",
        },
       
      })

      setJobs(res.data.jobs)
      setSelected(res.data.jobs[0] || null)
      setMatchData(null)
      setSearched(true)
    } catch (err) {
      setError("Failed to fetch jobs. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Auto re-fetch when API filters change
  useEffect(() => {
    if (searched) fetchJobs(true)
  }, [datePosted, remoteOnly])

  // Frontend experience level filter
  useEffect(() => {
    if (!experienceLevel) { setFilteredJobs(jobs); return }
    const level = EXPERIENCE_LEVELS.find(l => l.value === experienceLevel)
    if (!level) { setFilteredJobs(jobs); return }
    const filtered = jobs.filter(job =>
      level.keywords.some(kw => job.title.toLowerCase().includes(kw))
    )
    setFilteredJobs(filtered.length > 0 ? filtered : jobs)
  }, [experienceLevel, jobs])

  useEffect(() => { fetchJobs(true) }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchJobs(true)
  }

  const handleMatchScore = async () => {
    if (!selected) return
    try {
      setMatchLoading(true)
      setMatchError("")
      setMatchData(null)
      const res = await api.post("/api/jobs/match", {
        jobDescription: selected.description,
        jobTitle: selected.title,
        jobCompany: selected.company,
      }, )
      setMatchData(res.data.match)
    } catch (err) {
      setMatchError("Failed to calculate match score")
    } finally {
      setMatchLoading(false)
    }
  }

  // Save / unsave job
  const handleSaveJob = async (job) => {
    const isSaved = !!savedJobIds[job.id]
    setSaveLoading(prev => ({ ...prev, [job.id]: true }))
    try {
      if (isSaved) {
        await api.delete(`/api/saved-jobs/${job.id}` )
        setSavedJobIds(prev => {
          const updated = { ...prev }
          delete updated[job.id]
          return updated
        })
      } else {
        await api.post("/api/saved-jobs", {
          jobId: job.id,
          title: job.title,
          company: job.company,
          location: job.location,
          type: job.type,
          salary: job.salary,
          description: job.description,
          applyLink: job.applyLink,
          logo: job.logo,
          isRemote: job.isRemote,
          posted: job.posted,
          matchScore: matchData?.matchScore || 0,
        }, )
        setSavedJobIds(prev => ({ ...prev, [job.id]: { status: 'Saved', matchScore: 0 } }))
      }
    } catch (err) {
      console.error('Save job error:', err.message)
    } finally {
      setSaveLoading(prev => ({ ...prev, [job.id]: false }))
    }
  }

  // Mark as applied
  const handleApply = async (job) => {
    // If not saved yet, save it first with Applied status
    try {
      if (!savedJobIds[job.id]) {
        await api.post("/api/saved-jobs", {
          jobId: job.id,
          title: job.title,
          company: job.company,
          location: job.location,
          type: job.type,
          salary: job.salary,
          description: job.description,
          applyLink: job.applyLink,
          logo: job.logo,
          isRemote: job.isRemote,
          posted: job.posted,
          matchScore: matchData?.matchScore || 0,
        }, )
      }
      await api.patch(`/api/saved-jobs/${job.id}/status`, { status: 'Applied' } )
      setSavedJobIds(prev => ({ ...prev, [job.id]: { status: 'Applied', matchScore: matchData?.matchScore || 0 } }))
      setAppliedJobs(prev => ({ ...prev, [job.id]: true }))
    } catch (err) {
      console.error('Apply mark error:', err.message)
    }
  }

  // Share job via WhatsApp
  const handleShare = (job) => {
    const text = `🚀 Check out this job!\n\n*${job.title}* at *${job.company}*\n📍 ${job.location}\n\nApply here: ${job.applyLink}`
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }

  // Generate cover letter
  const handleCoverLetter = async () => {
    if (!selected) return
    setCoverLetterModal(true)
    setCoverLetterLoading(true)
    setCoverLetterText("")
    setCoverLetterError("")
    setCopied(false)
    try {
      const res = await api.post("/api/jobs/cover-letter", {
        jobDescription: selected.description,
        jobTitle: selected.title,
        jobCompany: selected.company,
      }, )
      setCoverLetterText(res.data.coverLetter)
    } catch (err) {
      setCoverLetterError("Failed to generate cover letter. Please try again.")
    } finally {
      setCoverLetterLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetterText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

const handleTailorResume = async () => {
    if (!selected) return
    setTailorModal(true)
    setTailorLoading(true)
    setTailorData(null)
    setTailorError("")
    try {
      const res = await api.post("/api/jobs/tailor-resume", {
        jobDescription: selected.description,
        jobTitle: selected.title,
        jobCompany: selected.company,
      }, )
      setTailorData(res.data.tailoring)
    } catch (err) {
      setTailorError("Failed to generate suggestions. Please try again.")
    } finally {
      setTailorLoading(false)
    }
  }

  const activeFilterCount = [datePosted, remoteOnly, experienceLevel].filter(Boolean).length
  const displayJobs = experienceLevel ? filteredJobs : jobs

  return (
    <DashboardLayout title="Job Search">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex items-center gap-3 mb-3 flex-wrap">
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2 flex-1 min-w-48">
          <span className="text-[#94A3B8] text-xs">🔍</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Job title, skills, or keywords..."
            className="bg-transparent text-white text-xs placeholder-[#4B5563] focus:outline-none w-full"
          />
        </div>
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
          <span className="text-[#94A3B8] text-xs">📍</span>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location..."
            className="bg-transparent text-white text-xs placeholder-[#4B5563] focus:outline-none w-28"
          />
        </div>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="bg-white/5 border border-white/10 text-[#94A3B8] text-xs rounded-lg px-3 py-2 focus:outline-none"
        >
          {JOB_TYPES.map(t => (
            <option key={t} value={t} className="bg-[#111827]">{JOB_TYPE_LABELS[t]}</option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg border transition ${
            activeFilterCount > 0
              ? "border-[#00D4AA]/50 bg-[#00D4AA]/10 text-[#00D4AA]"
              : "border-white/10 bg-white/5 text-[#94A3B8] hover:text-white"
          }`}
        >
          ⚙ Filters
          {activeFilterCount > 0 && (
            <span className="bg-[#00D4AA] text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>

        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-[#00D4AA] to-[#0099FF] text-white text-xs font-semibold px-5 py-2 rounded-lg hover:opacity-90 transition disabled:opacity-60"
        >
          {loading ? "Searching..." : "Search Jobs"}
        </button>
      </form>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-[#111827] border border-white/10 rounded-xl p-4 mb-3 flex items-center gap-6 flex-wrap">
          <div>
            <p className="text-[#94A3B8] text-[10px] font-medium mb-2">DATE POSTED</p>
            <div className="flex gap-2 flex-wrap">
              {DATE_POSTED_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setDatePosted(datePosted === opt.value ? "" : opt.value)}
                  className={`text-[10px] px-3 py-1.5 rounded-full border transition ${
                    datePosted === opt.value
                      ? "border-[#00D4AA] bg-[#00D4AA]/10 text-[#00D4AA]"
                      : "border-white/10 text-[#94A3B8] hover:border-[#00D4AA]/50 hover:text-[#00D4AA]"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="w-px h-10 bg-white/10" />

          <div>
            <p className="text-[#94A3B8] text-[10px] font-medium mb-2">EXPERIENCE LEVEL</p>
            <div className="flex gap-2 flex-wrap">
              {EXPERIENCE_LEVELS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setExperienceLevel(experienceLevel === opt.value ? "" : opt.value)}
                  className={`text-[10px] px-3 py-1.5 rounded-full border transition ${
                    experienceLevel === opt.value
                      ? "border-[#00D4AA] bg-[#00D4AA]/10 text-[#00D4AA]"
                      : "border-white/10 text-[#94A3B8] hover:border-[#00D4AA]/50 hover:text-[#00D4AA]"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="w-px h-10 bg-white/10" />

          <div>
            <p className="text-[#94A3B8] text-[10px] font-medium mb-2">WORK MODE</p>
            <button
              type="button"
              onClick={() => setRemoteOnly(!remoteOnly)}
              className={`flex items-center gap-2 text-[10px] px-3 py-1.5 rounded-full border transition ${
                remoteOnly
                  ? "border-[#00D4AA] bg-[#00D4AA]/10 text-[#00D4AA]"
                  : "border-white/10 text-[#94A3B8] hover:border-[#00D4AA]/50"
              }`}
            >
              <span className={`w-3 h-3 rounded-full border flex items-center justify-center ${
                remoteOnly ? "border-[#00D4AA] bg-[#00D4AA]" : "border-[#94A3B8]"
              }`}>
                {remoteOnly && <span className="text-black text-[8px]">✓</span>}
              </span>
              Remote Only
            </button>
          </div>

          {activeFilterCount > 0 && (
            <>
              <div className="w-px h-10 bg-white/10" />
              <button
                type="button"
                onClick={() => { setDatePosted(""); setRemoteOnly(false); setExperienceLevel("") }}
                className="text-[#FF4D6D] text-[10px] hover:underline"
              >
                ✕ Clear All
              </button>
            </>
          )}
        </div>
      )}

      {error && (
        <div className="bg-[#FF4D6D]/10 border border-[#FF4D6D]/30 text-[#FF4D6D] text-xs px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 gap-6">
          <div className="relative w-24 h-24">
            <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="none" />
              <circle cx="50" cy="50" r="40" stroke="url(#grad)" strokeWidth="8" fill="none"
                strokeLinecap="round" strokeDasharray="251" strokeDashoffset="60"
                className="animate-spin" style={{ animationDuration: '1.5s' }}
              />
              <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00D4AA" />
                  <stop offset="100%" stopColor="#0099FF" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl">🔍</span>
            </div>
          </div>
          <div className="text-center">
            <p className="text-white text-sm font-semibold mb-1">Searching Jobs...</p>
            <p className="text-[#94A3B8] text-xs">Fetching from LinkedIn, Indeed & more</p>
          </div>
          <div className="flex gap-1.5">
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#00D4AA]"
                style={{ animation: 'bounce 1s infinite', animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex gap-4">
          {/* Job List */}
          <div className="w-72 flex-shrink-0">
            <p className="text-[#94A3B8] text-xs mb-3">
              {displayJobs.length} Opportunities found · <span className="text-white">Sort: Relevance</span>
              {experienceLevel && (
                <span className="text-[#00D4AA]"> · {EXPERIENCE_LEVELS.find(l => l.value === experienceLevel)?.label}</span>
              )}
            </p>
            <div className="space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
              {displayJobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => { setSelected(job); setMatchData(null); setMatchError("") }}
                  className={`p-3 rounded-xl border cursor-pointer transition relative ${
                    selected?.id === job.id
                      ? "border-[#00D4AA]/50 bg-[#00D4AA]/5"
                      : "border-white/10 bg-[#111827] hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    {job.logo ? (
                      <img src={job.logo} alt={job.company} className="w-8 h-8 rounded-lg object-contain bg-white/10 p-0.5" />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-xs">🏢</div>
                    )}
                    <div className="flex items-center gap-1">
                      {appliedJobs[job.id] && (
                        <span className="text-[#00D4AA] text-[9px] font-bold bg-[#00D4AA]/10 px-2 py-0.5 rounded-full">APPLIED</span>
                      )}
                      {job.isRemote && !appliedJobs[job.id] && (
                        <span className="text-[#00D4AA] text-[9px] font-bold bg-[#00D4AA]/10 px-2 py-0.5 rounded-full">REMOTE</span>
                      )}
                      {/* Bookmark button */}
                      <button
                        onClick={(e) => { e.stopPropagation(); handleSaveJob(job) }}
                        disabled={saveLoading[job.id]}
                        className="text-sm hover:scale-110 transition-transform"
                        title={savedJobIds[job.id] ? "Remove from saved" : "Save job"}
                      >
                        {saveLoading[job.id] ? (
                          <span className="text-[#94A3B8]">...</span>
                        ) : savedJobIds[job.id] ? (
                          <span className="text-[#00D4AA]">🔖</span>
                        ) : (
                          <span className="text-[#94A3B8] hover:text-[#00D4AA]">🔖</span>
                        )}
                      </button>
                    </div>
                  </div>
                  <p className="text-white text-xs font-semibold mb-0.5 line-clamp-1">{job.title}</p>
                  <p className="text-[#94A3B8] text-[10px] mb-2">{job.company} · {job.location}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[#94A3B8] text-[10px]">{job.salary}</span>
                    <span className="bg-white/5 text-[#94A3B8] text-[9px] px-2 py-0.5 rounded-full">
                      {JOB_TYPE_LABELS[job.type] || job.type}
                    </span>
                  </div>
                </div>
              ))}

              {displayJobs.length > 0 && (
                <button
                  onClick={() => { setPage(p => p + 1); fetchJobs() }}
                  className="w-full text-[#00D4AA] text-xs py-2 border border-[#00D4AA]/20 rounded-lg hover:bg-[#00D4AA]/5 transition mt-2"
                >
                  Load More
                </button>
              )}

              {displayJobs.length === 0 && !loading && (
                <div className="text-center py-8">
                  <p className="text-[#94A3B8] text-xs">No jobs found for selected filters.</p>
                  <button onClick={() => setExperienceLevel("")} className="text-[#00D4AA] text-xs mt-2 hover:underline">
                    Clear experience filter
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Job Detail */}
          {selected ? (
            <div className="flex-1 bg-[#111827] border border-white/10 rounded-xl p-6 overflow-y-auto max-h-[calc(100vh-280px)]">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {selected.logo ? (
                    <img src={selected.logo} alt={selected.company} className="w-12 h-12 rounded-xl object-contain bg-white/10 p-1" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-xl">🏢</div>
                  )}
                  <div>
                    <h2 className="text-white text-xl font-bold">{selected.title}</h2>
                    <p className="text-[#94A3B8] text-xs">{selected.company} · {selected.location} · {selected.posted}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* Share button */}
                  <button
                    onClick={() => handleShare(selected)}
                    className="flex items-center gap-1.5 bg-white/5 border border-white/10 text-[#94A3B8] text-xs px-3 py-1.5 rounded-lg hover:text-white hover:border-white/20 transition"
                    title="Share on WhatsApp"
                  >
                    📤 Share
                  </button>
                  {/* Save button in detail */}
                  <button
                    onClick={() => handleSaveJob(selected)}
                    disabled={saveLoading[selected.id]}
                    className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition ${
                      savedJobIds[selected.id]
                        ? "border-[#00D4AA]/50 bg-[#00D4AA]/10 text-[#00D4AA]"
                        : "border-white/10 bg-white/5 text-[#94A3B8] hover:text-white"
                    }`}
                  >
                    {savedJobIds[selected.id] ? "🔖 Saved" : "🔖 Save Job"}
                  </button>
                  {selected.isRemote && (
                    <span className="bg-[#00D4AA]/20 text-[#00D4AA] text-xs px-3 py-1 rounded-full">Remote</span>
                  )}
                  <span className="bg-white/10 text-white text-xs px-3 py-1 rounded-full">
                    {JOB_TYPE_LABELS[selected.type] || selected.type}
                  </span>
                </div>
              </div>

              {/* AI Match Card */}
              <div className="bg-[#0D1321] border border-[#00D4AA]/20 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[#00D4AA] text-xs font-bold">⚡ AI Match Score</p>
                  {!matchData && (
                    <button
                      onClick={handleMatchScore}
                      disabled={matchLoading}
                      className="bg-gradient-to-r from-[#00D4AA] to-[#0099FF] text-white text-[10px] font-semibold px-3 py-1.5 rounded-lg hover:opacity-90 transition disabled:opacity-60"
                    >
                      {matchLoading ? "Analyzing..." : "⚡ Calculate Match"}
                    </button>
                  )}
                </div>

                {matchLoading && (
                  <div className="flex items-center gap-3 py-2">
                    <div className="w-5 h-5 border-2 border-[#00D4AA] border-t-transparent rounded-full animate-spin" />
                    <p className="text-[#94A3B8] text-xs">Comparing your profile with job requirements...</p>
                  </div>
                )}

                {matchError && <p className="text-[#FF4D6D] text-xs">{matchError}</p>}

                {matchData && (
                  <div>
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-16 h-16 rounded-full border-4 flex flex-col items-center justify-center flex-shrink-0"
                        style={{ borderColor: matchData.matchScore >= 70 ? '#00D4AA' : matchData.matchScore >= 50 ? '#FFB800' : '#FF4D6D' }}
                      >
                        <p className="font-bold text-sm leading-none"
                          style={{ color: matchData.matchScore >= 70 ? '#00D4AA' : matchData.matchScore >= 50 ? '#FFB800' : '#FF4D6D' }}
                        >
                          {matchData.matchScore}%
                        </p>
                        <p className="text-[#94A3B8] text-[8px]">MATCH</p>
                      </div>
                      <div className="flex-1">
                        <p className="text-[#94A3B8] text-xs mb-2">{matchData.summary}</p>
                        <div className="flex gap-2 flex-wrap">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                            matchData.recommendation === 'Apply' ? 'bg-[#00D4AA]/20 text-[#00D4AA]' :
                            matchData.recommendation === 'Consider' ? 'bg-[#FFB800]/20 text-[#FFB800]' :
                            'bg-[#FF4D6D]/20 text-[#FF4D6D]'
                          }`}>
                            {matchData.recommendation === 'Apply' ? '✅' : matchData.recommendation === 'Consider' ? '⚠️' : '❌'} {matchData.recommendation}
                          </span>
                          <span className="bg-white/10 text-[#94A3B8] text-[10px] px-2 py-0.5 rounded-full">
                            Experience: {matchData.experienceMatch}
                          </span>
                          <span className="bg-white/10 text-[#94A3B8] text-[10px] px-2 py-0.5 rounded-full">
                            Location: {matchData.locationMatch}
                          </span>
                        </div>
                      </div>
                    </div>

                    {matchData.skillsMatch?.matched?.length > 0 && (
                      <div className="mb-2">
                        <p className="text-[#94A3B8] text-[10px] mb-1">✅ Matched Skills</p>
                        <div className="flex flex-wrap gap-1">
                          {matchData.skillsMatch.matched.map((s, i) => (
                            <span key={i} className="bg-[#00D4AA]/10 text-[#00D4AA] text-[9px] px-2 py-0.5 rounded-full">{s}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {matchData.skillsMatch?.missing?.length > 0 && (
                      <div>
                        <p className="text-[#94A3B8] text-[10px] mb-1">⚠️ Missing Skills</p>
                        <div className="flex flex-wrap gap-1">
                          {matchData.skillsMatch.missing.map((s, i) => (
                            <span key={i} className="bg-[#FF4D6D]/10 text-[#FF4D6D] text-[9px] px-2 py-0.5 rounded-full">{s}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    <button onClick={handleMatchScore} className="mt-3 text-[#94A3B8] text-[10px] hover:text-white transition">
                      🔄 Recalculate
                    </button>
                  </div>
                )}

                {!matchData && !matchLoading && (
                  <p className="text-[#4B5563] text-xs">Click "Calculate Match" to see how well you match this job.</p>
                )}
              </div>

              {/* Salary */}
              {selected.salary !== 'Not disclosed' && (
                <div className="bg-[#0D1321] border border-white/5 rounded-xl p-3 mb-4">
                  <p className="text-[#94A3B8] text-[10px] mb-1">SALARY RANGE</p>
                  <p className="text-[#00D4AA] text-lg font-bold">{selected.salary}</p>
                </div>
              )}

              {/* Action Buttons */}
             <div className="flex gap-3 mb-4">
                <a
                  href={selected.applyLink}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => handleApply(selected)}
                  className="flex-1 bg-gradient-to-r from-[#00D4AA] to-[#0099FF] text-white text-xs font-semibold py-2.5 rounded-lg hover:opacity-90 transition text-center"
                >
                  {appliedJobs[selected.id] ? "✅ Applied" : "🚀 Apply Now"}
                </a>
                <button
                  onClick={handleCoverLetter}
                  className="flex-1 bg-white/5 border border-white/10 text-white text-xs font-semibold py-2.5 rounded-lg hover:bg-white/10 transition"
                >
                  ✨ Cover Letter
                </button>
                <button
                  onClick={handleTailorResume}
                  className="flex-1 bg-white/5 border border-white/10 text-white text-xs font-semibold py-2.5 rounded-lg hover:bg-white/10 transition"
                >
                  🎯 Tailor Resume
                </button>
              </div>

              {/* Description */}
              <div>
                <p className="text-white text-sm font-semibold mb-2">Job Description</p>
                <p className="text-[#94A3B8] text-xs leading-relaxed whitespace-pre-line line-clamp-[20]">
                  {selected.description}
                </p>
              </div>

              {selected.highlights?.Qualifications?.length > 0 && (
                <div className="mt-4">
                  <p className="text-white text-sm font-semibold mb-2">Qualifications</p>
                  <ul className="space-y-2">
                    {selected.highlights.Qualifications.slice(0, 5).map((q, i) => (
                      <li key={i} className="flex items-start gap-2 text-[#94A3B8] text-xs">
                        <span className="text-[#00D4AA] mt-0.5">✓</span>{q}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selected.highlights?.Responsibilities?.length > 0 && (
                <div className="mt-4">
                  <p className="text-white text-sm font-semibold mb-2">Responsibilities</p>
                  <ul className="space-y-2">
                    {selected.highlights.Responsibilities.slice(0, 5).map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-[#94A3B8] text-xs">
                        <span className="text-[#00D4AA] mt-0.5">→</span>{r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 bg-[#111827] border border-white/10 rounded-xl flex items-center justify-center">
              <p className="text-[#4B5563] text-sm">Select a job to see details</p>
            </div>
          )}
        </div>
      )}

      {/* Resume Tailoring Modal */}
      {tailorModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111827] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <div>
                <h3 className="text-white font-bold text-sm">🎯 Resume Tailoring Tips</h3>
                <p className="text-[#94A3B8] text-xs mt-0.5">{selected?.title} at {selected?.company}</p>
              </div>
              <button
                onClick={() => setTailorModal(false)}
                className="text-[#94A3B8] hover:text-white text-xl transition"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {tailorLoading && (
                <div className="flex flex-col items-center justify-center h-40 gap-3">
                  <div className="w-8 h-8 border-2 border-[#00D4AA] border-t-transparent rounded-full animate-spin" />
                  <p className="text-[#94A3B8] text-xs">Analyzing resume against job requirements...</p>
                </div>
              )}

              {tailorError && (
                <p className="text-[#FF4D6D] text-xs text-center py-8">{tailorError}</p>
              )}

              {tailorData && (
                <>
                  {/* Overall Fit */}
                  <div className="bg-[#0D1321] border border-[#00D4AA]/20 rounded-xl p-3">
                    <p className="text-[#00D4AA] text-[10px] font-bold mb-1">OVERALL FIT</p>
                    <p className="text-white text-xs">{tailorData.overallFit}</p>
                  </div>

                  {/* Strengths to Highlight */}
                  {tailorData.strengthsToHighlight?.length > 0 && (
                    <div>
                      <p className="text-white text-xs font-semibold mb-2">✅ Strengths to Highlight</p>
                      <div className="flex flex-wrap gap-2">
                        {tailorData.strengthsToHighlight.map((s, i) => (
                          <span key={i} className="bg-[#00D4AA]/10 text-[#00D4AA] text-[10px] px-3 py-1 rounded-full border border-[#00D4AA]/20">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Keywords to Add */}
                  {tailorData.keywordsToAdd?.length > 0 && (
                    <div>
                      <p className="text-white text-xs font-semibold mb-2">🔑 Keywords to Add</p>
                      <div className="flex flex-wrap gap-2">
                        {tailorData.keywordsToAdd.map((k, i) => (
                          <span key={i} className="bg-[#FFB800]/10 text-[#FFB800] text-[10px] px-3 py-1 rounded-full border border-[#FFB800]/20">
                            + {k}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Suggestions */}
                  {tailorData.suggestions?.length > 0 && (
                    <div>
                      <p className="text-white text-xs font-semibold mb-2">💡 Specific Changes</p>
                      <div className="space-y-2">
                        {tailorData.suggestions.map((s, i) => (
                          <div key={i} className="bg-[#0D1321] border border-white/5 rounded-xl p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                s.priority === 'High' ? 'bg-[#FF4D6D]/20 text-[#FF4D6D]' :
                                s.priority === 'Medium' ? 'bg-[#FFB800]/20 text-[#FFB800]' :
                                'bg-white/10 text-[#94A3B8]'
                              }`}>
                                {s.priority}
                              </span>
                              <span className="text-[#94A3B8] text-[10px]">{s.section}</span>
                            </div>
                            <p className="text-white text-xs mb-1">{s.action}</p>
                            <p className="text-[#94A3B8] text-[10px]">{s.reason}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="p-4 border-t border-white/10">
              <button
                onClick={() => setTailorModal(false)}
                className="w-full bg-white/5 border border-white/10 text-white text-xs font-semibold py-2.5 rounded-lg hover:bg-white/10 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    

      {/* Cover Letter Modal */}
      {coverLetterModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111827] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <div>
                <h3 className="text-white font-bold text-sm">✨ AI Cover Letter</h3>
                <p className="text-[#94A3B8] text-xs mt-0.5">{selected?.title} at {selected?.company}</p>
              </div>
              <button
                onClick={() => setCoverLetterModal(false)}
                className="text-[#94A3B8] hover:text-white text-xl transition"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {coverLetterLoading && (
                <div className="flex flex-col items-center justify-center h-40 gap-3">
                  <div className="w-8 h-8 border-2 border-[#00D4AA] border-t-transparent rounded-full animate-spin" />
                  <p className="text-[#94A3B8] text-xs">Generating personalized cover letter...</p>
                </div>
              )}
              {coverLetterError && (
                <p className="text-[#FF4D6D] text-xs text-center py-8">{coverLetterError}</p>
              )}
              {coverLetterText && (
                <p className="text-[#94A3B8] text-xs leading-relaxed whitespace-pre-line">{coverLetterText}</p>
              )}
            </div>

            {coverLetterText && (
              <div className="p-4 border-t border-white/10 flex gap-3">
                <button
                  onClick={handleCopy}
                  className="flex-1 bg-gradient-to-r from-[#00D4AA] to-[#0099FF] text-white text-xs font-semibold py-2.5 rounded-lg hover:opacity-90 transition"
                >
                  {copied ? "✅ Copied!" : "📋 Copy to Clipboard"}
                </button>
                <button
                  onClick={() => setCoverLetterModal(false)}
                  className="flex-1 bg-white/5 border border-white/10 text-white text-xs font-semibold py-2.5 rounded-lg hover:bg-white/10 transition"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}