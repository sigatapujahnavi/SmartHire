// // client/src/pages/Applications.jsx
// import { useState, useEffect } from "react"
// import api from '../services/api'
// import DashboardLayout from "../components/layout/DashboardLayout"

// const STATUS_OPTIONS = ["Saved", "Applied", "Interview", "Offer", "Rejected"]

// const STATUS_COLORS = {
//   Saved: "#0099FF",
//   Applied: "#00D4AA",
//   Interview: "#FFB800",
//   Offer: "#00D4AA",
//   Rejected: "#FF4D6D",
// }

// const ITEMS_PER_PAGE = 10

// export default function Applications() {
//   const [jobs, setJobs] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [activeFilter, setActiveFilter] = useState("All")
//   const [page, setPage] = useState(1)
//   const [notesModal, setNotesModal] = useState(null) // { jobId, notes }
//   const [notesInput, setNotesInput] = useState("")
//   const [savingNotes, setSavingNotes] = useState(false)
//   const [deletingId, setDeletingId] = useState(null)
//   const [updatingId, setUpdatingId] = useState(null)

//   useEffect(() => {
//     fetchJobs()
//   }, [])

//   const fetchJobs = async () => {
//     try {
//       setLoading(true)
//       const res = await api.get("/api/saved-jobs" )
//       setJobs(res.data.savedJobs || [])
//     } catch (err) {
//       console.error("Failed to fetch saved jobs:", err)
//     } finally {
//       setLoading(false)
//     }
//   }

//   // --- Counts for filter tabs ---
//   const counts = {
//     All: jobs.length,
//     Saved: jobs.filter((j) => j.status === "Saved").length,
//     Applied: jobs.filter((j) => j.status === "Applied").length,
//     Interview: jobs.filter((j) => j.status === "Interview").length,
//     Offer: jobs.filter((j) => j.status === "Offer").length,
//     Rejected: jobs.filter((j) => j.status === "Rejected").length,
//   }

//   const filters = ["All", ...STATUS_OPTIONS]

//   const filteredJobs =
//     activeFilter === "All" ? jobs : jobs.filter((j) => j.status === activeFilter)

//   const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE)
//   const paginatedJobs = filteredJobs.slice(
//     (page - 1) * ITEMS_PER_PAGE,
//     page * ITEMS_PER_PAGE
//   )

//   const handleFilterChange = (f) => {
//     setActiveFilter(f)
//     setPage(1)
//   }

//   // --- Status update ---
//   const handleStatusChange = async (jobId, newStatus) => {
//     setUpdatingId(jobId)
//     try {
//       const res = await api.patch(
//         `/api/saved-jobs/${jobId}/status`,
//         { status: newStatus },
        
//       )
//       setJobs((prev) =>
//         prev.map((j) => (j.jobId === jobId ? res.data.savedJob : j))
//       )
//     } catch (err) {
//       console.error("Failed to update status:", err)
//     } finally {
//       setUpdatingId(null)
//     }
//   }

//   // --- Delete ---
//   const handleDelete = async (jobId) => {
//     if (!window.confirm("Remove this job from your tracker?")) return
//     setDeletingId(jobId)
//     try {
//       await api.delete(`/api/saved-jobs/${jobId}` )
//       setJobs((prev) => prev.filter((j) => j.jobId !== jobId))
//     } catch (err) {
//       console.error("Failed to delete job:", err)
//     } finally {
//       setDeletingId(null)
//     }
//   }

//   // --- Notes ---
//   const openNotes = (job) => {
//     setNotesModal({ jobId: job.jobId })
//     setNotesInput(job.notes || "")
//   }

//   const saveNotes = async () => {
//     if (!notesModal) return
//     setSavingNotes(true)
//     try {
//       const res = await api.patch(
//         `/api/saved-jobs/${notesModal.jobId}/status`,
//         { notes: notesInput },
        
//       )
//       setJobs((prev) =>
//         prev.map((j) => (j.jobId === notesModal.jobId ? res.data.savedJob : j))
//       )
//       setNotesModal(null)
//     } catch (err) {
//       console.error("Failed to save notes:", err)
//     } finally {
//       setSavingNotes(false)
//     }
//   }

//   const formatDate = (dateStr) => {
//     if (!dateStr) return "—"
//     return new Date(dateStr).toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//       year: "numeric",
//     })
//   }

//   const getMatchColor = (score) => {
//     if (score >= 80) return "#00D4AA"
//     if (score >= 60) return "#FFB800"
//     return "#FF4D6D"
//   }

//   return (
//     <DashboardLayout title="Applications">
//       <div className="bg-[#111827] border border-white/10 rounded-xl p-6">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-4">
//           <div>
//             <h2 className="text-white font-bold text-lg">Application Tracker</h2>
//             <p className="text-[#94A3B8] text-xs">
//               Manage and track your AI-matched career opportunities.
//             </p>
//           </div>
//         </div>

//         {/* Filters */}
//         <div className="flex gap-2 mb-4 flex-wrap">
//           {filters.map((f) => (
//             <button
//               key={f}
//               onClick={() => handleFilterChange(f)}
//               className={`text-xs px-3 py-1.5 rounded-full border transition ${
//                 activeFilter === f
//                   ? "bg-[#00D4AA]/20 border-[#00D4AA]/50 text-[#00D4AA]"
//                   : "border-white/10 text-[#94A3B8] hover:text-white"
//               }`}
//             >
//               {f} ({counts[f]})
//             </button>
//           ))}
//         </div>

//         {/* Table */}
//         {loading ? (
//           <div className="text-center py-16 text-[#94A3B8] text-sm">Loading applications...</div>
//         ) : filteredJobs.length === 0 ? (
//           <div className="text-center py-16">
//             <p className="text-[#94A3B8] text-sm">No applications found.</p>
//             <p className="text-[#94A3B8] text-xs mt-1">
//               Save jobs from the Job Search page to track them here.
//             </p>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="border-b border-white/5">
//                   {["COMPANY", "ROLE", "SAVED DATE", "STATUS", "AI MATCH", "NOTES", "ACTIONS"].map(
//                     (h) => (
//                       <th
//                         key={h}
//                         className="text-left text-[#94A3B8] text-[10px] font-medium pb-3 pr-4"
//                       >
//                         {h}
//                       </th>
//                     )
//                   )}
//                 </tr>
//               </thead>
//               <tbody>
//                 {paginatedJobs.map((job) => (
//                   <tr
//                     key={job.jobId}
//                     className="border-b border-white/5 hover:bg-white/[0.02] transition"
//                   >
//                     {/* Company */}
//                     <td className="py-3 pr-4">
//                       <div className="flex items-center gap-2">
//                         {job.logo ? (
//                           <img
//                             src={job.logo}
//                             alt={job.company}
//                             className="w-7 h-7 rounded-lg object-contain bg-white/10"
//                             onError={(e) => {
//                               e.target.style.display = "none"
//                               e.target.nextSibling.style.display = "flex"
//                             }}
//                           />
//                         ) : null}
//                         <div
//                           className="w-7 h-7 rounded-lg bg-white/10 items-center justify-center text-white text-xs font-bold"
//                           style={{ display: job.logo ? "none" : "flex" }}
//                         >
//                           {job.company?.[0] || "?"}
//                         </div>
//                         <span className="text-white text-xs">{job.company || "—"}</span>
//                       </div>
//                     </td>

//                     {/* Role */}
//                     <td className="py-3 pr-4">
//                       <p className="text-white text-xs font-medium">{job.title}</p>
//                       <p className="text-[#94A3B8] text-[10px]">
//                         {job.location} {job.type ? `· ${job.type}` : ""}
//                       </p>
//                     </td>

//                     {/* Date */}
//                     <td className="py-3 pr-4 text-[#94A3B8] text-xs whitespace-nowrap">
//                       {formatDate(job.savedAt)}
//                     </td>

//                     {/* Status Dropdown */}
//                     <td className="py-3 pr-4">
//                       <select
//                         value={job.status}
//                         onChange={(e) => handleStatusChange(job.jobId, e.target.value)}
//                         disabled={updatingId === job.jobId}
//                         className="text-[10px] font-semibold px-2 py-1 rounded-md border-0 cursor-pointer outline-none"
//                         style={{
//                           backgroundColor: `${STATUS_COLORS[job.status]}20`,
//                           color: STATUS_COLORS[job.status],
//                         }}
//                       >
//                         {STATUS_OPTIONS.map((s) => (
//                           <option
//                             key={s}
//                             value={s}
//                             style={{ backgroundColor: "#111827", color: "#fff" }}
//                           >
//                             {s}
//                           </option>
//                         ))}
//                       </select>
//                     </td>

//                     {/* Match Score */}
//                     <td className="py-3 pr-4">
//                       {job.matchScore > 0 ? (
//                         <div className="flex items-center gap-2">
//                           <div className="w-20 h-1.5 bg-white/10 rounded-full">
//                             <div
//                               className="h-1.5 rounded-full transition-all"
//                               style={{
//                                 width: `${job.matchScore}%`,
//                                 backgroundColor: getMatchColor(job.matchScore),
//                               }}
//                             />
//                           </div>
//                           <span
//                             className="text-xs"
//                             style={{ color: getMatchColor(job.matchScore) }}
//                           >
//                             {job.matchScore}%
//                           </span>
//                         </div>
//                       ) : (
//                         <span className="text-[#94A3B8] text-xs">—</span>
//                       )}
//                     </td>

//                     {/* Notes */}
//                     <td className="py-3 pr-4">
//                       <button
//                         onClick={() => openNotes(job)}
//                         className="text-xs px-2 py-1 rounded-lg border border-white/10 text-[#94A3B8] hover:text-white hover:border-white/30 transition"
//                         title={job.notes || "Add notes"}
//                       >
//                         {job.notes ? "📝 Edit" : "+ Note"}
//                       </button>
//                     </td>

//                     {/* Delete */}
//                     <td className="py-3">
//                       <button
//                         onClick={() => handleDelete(job.jobId)}
//                         disabled={deletingId === job.jobId}
//                         className="text-[#94A3B8] hover:text-[#FF4D6D] text-sm transition disabled:opacity-40"
//                         title="Remove"
//                       >
//                         {deletingId === job.jobId ? "..." : "🗑"}
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="flex items-center justify-between mt-4">
//             <p className="text-[#94A3B8] text-xs">
//               Showing {(page - 1) * ITEMS_PER_PAGE + 1}–
//               {Math.min(page * ITEMS_PER_PAGE, filteredJobs.length)} of {filteredJobs.length}
//             </p>
//             <div className="flex items-center gap-1">
//               <button
//                 onClick={() => setPage((p) => Math.max(1, p - 1))}
//                 disabled={page === 1}
//                 className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 text-[#94A3B8] text-xs hover:text-white transition disabled:opacity-40"
//               >
//                 ‹
//               </button>
//               {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
//                 <button
//                   key={p}
//                   onClick={() => setPage(p)}
//                   className={`w-7 h-7 rounded-lg text-xs transition ${
//                     page === p
//                       ? "bg-[#00D4AA]/20 border border-[#00D4AA]/30 text-[#00D4AA]"
//                       : "bg-white/5 border border-white/10 text-[#94A3B8] hover:text-white"
//                   }`}
//                 >
//                   {p}
//                 </button>
//               ))}
//               <button
//                 onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//                 disabled={page === totalPages}
//                 className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 text-[#94A3B8] text-xs hover:text-white transition disabled:opacity-40"
//               >
//                 ›
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Notes Modal */}
//       {notesModal && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
//           <div className="bg-[#111827] border border-white/10 rounded-xl p-6 w-full max-w-md mx-4">
//             <h3 className="text-white font-semibold text-sm mb-1">Application Notes</h3>
//             <p className="text-[#94A3B8] text-xs mb-4">
//               Add private notes about this application — interviews, contacts, follow-ups.
//             </p>
//             <textarea
//               value={notesInput}
//               onChange={(e) => setNotesInput(e.target.value)}
//               placeholder="e.g. Spoke with recruiter Sarah, Round 2 on Friday..."
//               rows={5}
//               className="w-full bg-[#0D1321] border border-white/10 rounded-lg p-3 text-white text-xs placeholder-[#94A3B8] resize-none outline-none focus:border-[#00D4AA]/50 transition"
//             />
//             <div className="flex gap-2 mt-3 justify-end">
//               <button
//                 onClick={() => setNotesModal(null)}
//                 className="text-xs px-4 py-2 rounded-lg border border-white/10 text-[#94A3B8] hover:text-white transition"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={saveNotes}
//                 disabled={savingNotes}
//                 className="text-xs px-4 py-2 rounded-lg bg-gradient-to-r from-[#00D4AA] to-[#0099FF] text-white font-semibold hover:opacity-90 transition disabled:opacity-60"
//               >
//                 {savingNotes ? "Saving..." : "Save Notes"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </DashboardLayout>
//   )
// }

// client/src/pages/Applications.jsx
import { useState, useEffect } from "react"
import api from '../services/api'
import DashboardLayout from "../components/layout/DashboardLayout"

const STATUS_OPTIONS = ["Saved", "Applied", "Interview", "Offer", "Rejected"]

const STATUS_COLORS = {
  Saved: "#0099FF",
  Applied: "#00D4AA",
  Interview: "#FFB800",
  Offer: "#00D4AA",
  Rejected: "#FF4D6D",
}

const ITEMS_PER_PAGE = 10

export default function Applications() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState("All")
  const [page, setPage] = useState(1)
  const [notesModal, setNotesModal] = useState(null)
  const [notesInput, setNotesInput] = useState("")
  const [savingNotes, setSavingNotes] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const res = await api.get("/api/saved-jobs")
      setJobs(res.data.savedJobs || [])
    } catch (err) {
      console.error("Failed to fetch saved jobs:", err)
    } finally {
      setLoading(false)
    }
  }

  const counts = {
    All: jobs.length,
    Saved: jobs.filter((j) => j.status === "Saved").length,
    Applied: jobs.filter((j) => j.status === "Applied").length,
    Interview: jobs.filter((j) => j.status === "Interview").length,
    Offer: jobs.filter((j) => j.status === "Offer").length,
    Rejected: jobs.filter((j) => j.status === "Rejected").length,
  }

  const filters = ["All", ...STATUS_OPTIONS]

  const filteredJobs =
    activeFilter === "All" ? jobs : jobs.filter((j) => j.status === activeFilter)

  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE)
  const paginatedJobs = filteredJobs.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  )

  const handleFilterChange = (f) => {
    setActiveFilter(f)
    setPage(1)
  }

  const handleStatusChange = async (jobId, newStatus) => {
    setUpdatingId(jobId)
    try {
      const res = await api.patch(`/api/saved-jobs/${jobId}/status`, { status: newStatus })
      setJobs((prev) => prev.map((j) => (j.jobId === jobId ? res.data.savedJob : j)))
    } catch (err) {
      console.error("Failed to update status:", err)
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDelete = async (jobId) => {
    if (!window.confirm("Remove this job from your tracker?")) return
    setDeletingId(jobId)
    try {
      await api.delete(`/api/saved-jobs/${jobId}`)
      setJobs((prev) => prev.filter((j) => j.jobId !== jobId))
    } catch (err) {
      console.error("Failed to delete job:", err)
    } finally {
      setDeletingId(null)
    }
  }

  const openNotes = (job) => {
    setNotesModal({ jobId: job.jobId })
    setNotesInput(job.notes || "")
  }

  const saveNotes = async () => {
    if (!notesModal) return
    setSavingNotes(true)
    try {
      const res = await api.patch(`/api/saved-jobs/${notesModal.jobId}/status`, { notes: notesInput })
      setJobs((prev) => prev.map((j) => (j.jobId === notesModal.jobId ? res.data.savedJob : j)))
      setNotesModal(null)
    } catch (err) {
      console.error("Failed to save notes:", err)
    } finally {
      setSavingNotes(false)
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return "—"
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatDateShort = (dateStr) => {
    if (!dateStr) return "—"
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  const getMatchColor = (score) => {
    if (score >= 80) return "#00D4AA"
    if (score >= 60) return "#FFB800"
    return "#FF4D6D"
  }

  return (
    <DashboardLayout title="Applications">
      <div className="bg-[#111827] border border-white/10 rounded-xl p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-white font-bold text-base sm:text-lg">Application Tracker</h2>
            <p className="text-[#94A3B8] text-xs mt-0.5">
              Manage and track your AI-matched career opportunities.
            </p>
          </div>
        </div>

        {/* Filters — scrollable row on mobile */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => handleFilterChange(f)}
              className={`text-[10px] sm:text-xs px-3 py-1.5 rounded-full border transition whitespace-nowrap flex-shrink-0 ${
                activeFilter === f
                  ? "bg-[#00D4AA]/20 border-[#00D4AA]/50 text-[#00D4AA]"
                  : "border-white/10 text-[#94A3B8] hover:text-white"
              }`}
            >
              {f} ({counts[f]})
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-16 text-[#94A3B8] text-sm">Loading applications...</div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[#94A3B8] text-sm">No applications found.</p>
            <p className="text-[#94A3B8] text-xs mt-1">
              Save jobs from the Job Search page to track them here.
            </p>
          </div>
        ) : (
          <>
            {/* DESKTOP TABLE — hidden on mobile */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    {["COMPANY", "ROLE", "SAVED DATE", "STATUS", "AI MATCH", "NOTES", "ACTIONS"].map((h) => (
                      <th key={h} className="text-left text-[#94A3B8] text-[10px] font-medium pb-3 pr-4">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedJobs.map((job) => (
                    <tr key={job.jobId} className="border-b border-white/5 hover:bg-white/[0.02] transition">
                      {/* Company */}
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          {job.logo ? (
                            <img
                              src={job.logo}
                              alt={job.company}
                              className="w-7 h-7 rounded-lg object-contain bg-white/10"
                              onError={(e) => {
                                e.target.style.display = "none"
                                e.target.nextSibling.style.display = "flex"
                              }}
                            />
                          ) : null}
                          <div
                            className="w-7 h-7 rounded-lg bg-white/10 items-center justify-center text-white text-xs font-bold"
                            style={{ display: job.logo ? "none" : "flex" }}
                          >
                            {job.company?.[0] || "?"}
                          </div>
                          <span className="text-white text-xs">{job.company || "—"}</span>
                        </div>
                      </td>
                      {/* Role */}
                      <td className="py-3 pr-4">
                        <p className="text-white text-xs font-medium">{job.title}</p>
                        <p className="text-[#94A3B8] text-[10px]">
                          {job.location} {job.type ? `· ${job.type}` : ""}
                        </p>
                      </td>
                      {/* Date */}
                      <td className="py-3 pr-4 text-[#94A3B8] text-xs whitespace-nowrap">
                        {formatDate(job.savedAt)}
                      </td>
                      {/* Status */}
                      <td className="py-3 pr-4">
                        <select
                          value={job.status}
                          onChange={(e) => handleStatusChange(job.jobId, e.target.value)}
                          disabled={updatingId === job.jobId}
                          className="text-[10px] font-semibold px-2 py-1 rounded-md border-0 cursor-pointer outline-none"
                          style={{
                            backgroundColor: `${STATUS_COLORS[job.status]}20`,
                            color: STATUS_COLORS[job.status],
                          }}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s} style={{ backgroundColor: "#111827", color: "#fff" }}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>
                      {/* Match */}
                      <td className="py-3 pr-4">
                        {job.matchScore > 0 ? (
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-1.5 bg-white/10 rounded-full">
                              <div
                                className="h-1.5 rounded-full transition-all"
                                style={{ width: `${job.matchScore}%`, backgroundColor: getMatchColor(job.matchScore) }}
                              />
                            </div>
                            <span className="text-xs" style={{ color: getMatchColor(job.matchScore) }}>
                              {job.matchScore}%
                            </span>
                          </div>
                        ) : (
                          <span className="text-[#94A3B8] text-xs">—</span>
                        )}
                      </td>
                      {/* Notes */}
                      <td className="py-3 pr-4">
                        <button
                          onClick={() => openNotes(job)}
                          className="text-xs px-2 py-1 rounded-lg border border-white/10 text-[#94A3B8] hover:text-white hover:border-white/30 transition"
                          title={job.notes || "Add notes"}
                        >
                          {job.notes ? "📝 Edit" : "+ Note"}
                        </button>
                      </td>
                      {/* Delete */}
                      <td className="py-3">
                        <button
                          onClick={() => handleDelete(job.jobId)}
                          disabled={deletingId === job.jobId}
                          className="text-[#94A3B8] hover:text-[#FF4D6D] text-sm transition disabled:opacity-40"
                          title="Remove"
                        >
                          {deletingId === job.jobId ? "..." : "🗑"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MOBILE CARDS — shown only on mobile */}
            <div className="md:hidden space-y-3">
              {paginatedJobs.map((job) => (
                <div key={job.jobId} className="bg-[#0D1321] border border-white/5 rounded-xl p-4">
                  {/* Top row: logo + title + delete */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-9 h-9 rounded-lg bg-[#1a2332] flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {job.logo ? (
                        <img src={job.logo} alt={job.company} className="w-full h-full object-contain p-1"
                          onError={(e) => { e.target.style.display = "none" }} />
                      ) : (
                        <span className="text-white text-xs font-bold">{job.company?.[0] || "?"}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-semibold truncate">{job.title}</p>
                      <p className="text-[#94A3B8] text-xs truncate">{job.company}</p>
                      {job.location && <p className="text-[#4B5563] text-[10px] truncate">{job.location}{job.type ? ` · ${job.type}` : ""}</p>}
                    </div>
                    <button
                      onClick={() => handleDelete(job.jobId)}
                      disabled={deletingId === job.jobId}
                      className="text-[#4B5563] hover:text-[#FF4D6D] text-sm transition disabled:opacity-40 flex-shrink-0 p-1"
                    >
                      {deletingId === job.jobId ? "..." : "🗑"}
                    </button>
                  </div>

                  {/* Stats row */}
                  <div className="flex items-center gap-2 flex-wrap mb-3">
                    {/* Status select */}
                    <select
                      value={job.status}
                      onChange={(e) => handleStatusChange(job.jobId, e.target.value)}
                      disabled={updatingId === job.jobId}
                      className="text-[10px] font-semibold px-2 py-1 rounded-md border-0 cursor-pointer outline-none"
                      style={{
                        backgroundColor: `${STATUS_COLORS[job.status]}20`,
                        color: STATUS_COLORS[job.status],
                      }}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s} style={{ backgroundColor: "#111827", color: "#fff" }}>{s}</option>
                      ))}
                    </select>

                    {/* Match score */}
                    {job.matchScore > 0 && (
                      <span className="text-[10px] font-semibold px-2 py-1 rounded-md"
                        style={{ backgroundColor: `${getMatchColor(job.matchScore)}20`, color: getMatchColor(job.matchScore) }}>
                        {job.matchScore}% match
                      </span>
                    )}

                    {/* Date */}
                    <span className="text-[#4B5563] text-[10px] ml-auto">{formatDateShort(job.savedAt)}</span>
                  </div>

                  {/* Notes button */}
                  <button
                    onClick={() => openNotes(job)}
                    className="w-full text-xs py-2 rounded-lg border border-white/10 text-[#94A3B8] hover:text-white hover:border-white/30 transition text-center"
                  >
                    {job.notes ? "📝 Edit Notes" : "+ Add Notes"}
                  </button>

                  {/* Show notes preview */}
                  {job.notes && (
                    <p className="text-[#4B5563] text-[10px] mt-2 line-clamp-2 leading-relaxed">{job.notes}</p>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 flex-wrap gap-2">
            <p className="text-[#94A3B8] text-xs">
              Showing {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filteredJobs.length)} of {filteredJobs.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 text-[#94A3B8] text-xs hover:text-white transition disabled:opacity-40"
              >
                ‹
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-7 h-7 rounded-lg text-xs transition ${
                    page === p
                      ? "bg-[#00D4AA]/20 border border-[#00D4AA]/30 text-[#00D4AA]"
                      : "bg-white/5 border border-white/10 text-[#94A3B8] hover:text-white"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 text-[#94A3B8] text-xs hover:text-white transition disabled:opacity-40"
              >
                ›
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Notes Modal */}
      {notesModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4">
          <div className="bg-[#111827] border border-white/10 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-white font-semibold text-sm mb-1">Application Notes</h3>
            <p className="text-[#94A3B8] text-xs mb-4">
              Add private notes about this application — interviews, contacts, follow-ups.
            </p>
            <textarea
              value={notesInput}
              onChange={(e) => setNotesInput(e.target.value)}
              placeholder="e.g. Spoke with recruiter Sarah, Round 2 on Friday..."
              rows={5}
              className="w-full bg-[#0D1321] border border-white/10 rounded-lg p-3 text-white text-xs placeholder-[#94A3B8] resize-none outline-none focus:border-[#00D4AA]/50 transition"
            />
            <div className="flex gap-2 mt-3 justify-end">
              <button
                onClick={() => setNotesModal(null)}
                className="text-xs px-4 py-2 rounded-lg border border-white/10 text-[#94A3B8] hover:text-white transition"
              >
                Cancel
              </button>
              <button
                onClick={saveNotes}
                disabled={savingNotes}
                className="text-xs px-4 py-2 rounded-lg bg-gradient-to-r from-[#00D4AA] to-[#0099FF] text-white font-semibold hover:opacity-90 transition disabled:opacity-60"
              >
                {savingNotes ? "Saving..." : "Save Notes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}