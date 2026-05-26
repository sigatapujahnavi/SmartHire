// // client/src/pages/Resume.jsx
// import { useState, useEffect } from "react"
// import api from '../services/api' 
// import DashboardLayout from "../components/layout/DashboardLayout"

// export default function Resume() {
//   const [resume, setResume] = useState(null)
//   const [uploading, setUploading] = useState(false)
//   const [deleting, setDeleting] = useState(false)
//   const [error, setError] = useState("")
//   const [success, setSuccess] = useState("")
//   const [selectedFile, setSelectedFile] = useState(null)
//   const [analyzing, setAnalyzing] = useState(false)
//   const [analysis, setAnalysis] = useState(null)

//   const scores = analysis ? [
//     { label: "Keywords", value: analysis.scores.keywords },
//     { label: "Formatting", value: analysis.scores.formatting },
//     { label: "Readability", value: analysis.scores.readability },
//     { label: "Skills Alignment", value: analysis.scores.skillsAlignment },
//   ] : [
//     { label: "Keywords", value: 0 },
//     { label: "Formatting", value: 0 },
//     { label: "Readability", value: 0 },
//     { label: "Skills Alignment", value: 0 },
//   ]

//   // Fetch existing resume
// // Fetch existing resume and saved analysis
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [resumeRes, analysisRes] = await Promise.all([
//           api.get("/api/resume", ),
//           api.get("/api/resume/analysis", ),
//         ])
//         if (resumeRes.data.resume) setResume(resumeRes.data.resume)
//         if (analysisRes.data.analysis) setAnalysis(analysisRes.data.analysis)
//       } catch (err) {
//         console.error("Failed to fetch data", err)
//       }
//     }
//     fetchData()
//   }, [])

//   const handleAnalyze = async () => {
//     try {
//       setAnalyzing(true)
//       setError("")
//       const res = await api.post("/api/resume/analyze", {}, )
//       setAnalysis(res.data.analysis)
//       setSuccess("Resume analyzed successfully!")
//       setTimeout(() => setSuccess(""), 3000)
//     } catch (err) {
//       setError(err.response?.data?.message || "Analysis failed")
//     } finally {
//       setAnalyzing(false)
//     }
//   }

//   const handleFileSelect = (e) => {
//     const file = e.target.files[0]
//     if (file) {
//       setSelectedFile(file)
//       setError("")
//     }
//   }

//   const handleUpload = async () => {
//     if (!selectedFile) return
//     setError("")
//     setSuccess("")
//     try {
//       setUploading(true)
//       const formData = new FormData()
//       formData.append("resume", selectedFile)
//       const res = await api.post("/api/resume/upload", formData, {
//         withCredentials: true,
//         headers: { "Content-Type": "multipart/form-data" }
//       })
//       setResume({
//         url: res.data.resumeUrl,
//         originalName: res.data.resumeOriginalName,
//         uploadedAt: new Date(),
//       })
//       setSelectedFile(null)
//       setSuccess("Resume uploaded successfully!")
//       setTimeout(() => setSuccess(""), 3000)
//     } catch (err) {
//       setError(err.response?.data?.message || "Upload failed")
//     } finally {
//       setUploading(false)
//     }
//   }

//   const handleDelete = async () => {
//     if (!window.confirm("Are you sure you want to delete your resume?")) return
//     try {
//       setDeleting(true)
//       await api.delete("/api/resume", )
//       setResume(null)
//       setSuccess("Resume deleted.")
//       setTimeout(() => setSuccess(""), 3000)
//     } catch (err) {
//       setError("Failed to delete resume")
//     } finally {
//       setDeleting(false)
//     }
//   }

//   return (
//     <DashboardLayout title="Resume Analysis">
//       <div>
//         <h2 className="text-white text-2xl font-bold mb-1">Resume Optimization</h2>
//         <p className="text-[#94A3B8] text-sm mb-6">AI-driven ATS analysis to maximize your landing rate.</p>

//         <div className="grid grid-cols-2 gap-6">
//           {/* Left */}
//           <div className="space-y-4">
//             {/* Upload Zone */}
//             <div
//               className="bg-[#111827] border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-[#00D4AA]/40 transition cursor-pointer"
//               onClick={() => document.getElementById("resumeFileInput").click()}
//             >
//               <div className="w-12 h-12 rounded-xl bg-[#00D4AA]/10 flex items-center justify-center mx-auto mb-3 text-2xl">📄</div>
//               <p className="text-white font-semibold mb-1">
//                 {selectedFile ? selectedFile.name : "Upload Resume"}
//               </p>
//               <p className="text-[#94A3B8] text-xs mb-4">Drop your PDF or DOCX here. Maximum file size: 5MB.</p>
//               <input
//                 id="resumeFileInput"
//                 type="file"
//                 accept=".pdf,.docx,.doc"
//                 className="hidden"
//                 onChange={handleFileSelect}
//               />
//               <button
//                 type="button"
//                 onClick={(e) => { e.stopPropagation(); document.getElementById("resumeFileInput").click() }}
//                 className="bg-gradient-to-r from-[#00D4AA] to-[#0099FF] text-white text-xs font-semibold px-6 py-2 rounded-lg hover:opacity-90 transition"
//               >
//                 Select File
//               </button>
//             </div>

//             {selectedFile && (
//               <button
//                 onClick={handleUpload}
//                 disabled={uploading}
//                 className="w-full bg-gradient-to-r from-[#00D4AA] to-[#0099FF] text-white text-xs font-semibold py-2.5 rounded-lg hover:opacity-90 transition disabled:opacity-60"
//               >
//                 {uploading ? "Uploading..." : "Upload Resume"}
//               </button>
//             )}

//             {error && <div className="bg-[#FF4D6D]/10 border border-[#FF4D6D]/30 text-[#FF4D6D] text-xs px-4 py-3 rounded-lg">{error}</div>}
//             {success && <div className="bg-[#00D4AA]/10 border border-[#00D4AA]/30 text-[#00D4AA] text-xs px-4 py-3 rounded-lg">{success}</div>}

//             {/* Current Resume */}
//             {resume && (
//               <div className="bg-[#111827] border border-white/10 rounded-xl p-4">
//                 <div className="flex items-center justify-between mb-3">
//                   <div>
//                     <p className="text-white text-xs font-semibold">{resume.originalName}</p>
//                     <p className="text-[#94A3B8] text-[10px]">
//                       Uploaded {resume.uploadedAt ? new Date(resume.uploadedAt).toLocaleDateString() : "recently"}
//                     </p>
//                   </div>
//                   <div className="flex gap-2">
//                     <a
//                       href={resume.url}
//                       target="_blank"
//                       rel="noreferrer"
//                       className="text-[#00D4AA] text-xs hover:underline"
//                     >
//                       View
//                     </a>
//                     <button
//                       onClick={handleDelete}
//                       disabled={deleting}
//                       className="text-[#FF4D6D] text-xs hover:underline disabled:opacity-60"
//                     >
//                       {deleting ? "Deleting..." : "Delete"}
//                     </button>
//                   </div>
//                 </div>
//                 <div className="bg-[#0D1321] rounded-xl h-36 flex items-center justify-center border border-white/5">
//                   <div className="text-center">
//                     <span className="text-3xl">📋</span>
//                     <p className="text-[#94A3B8] text-xs mt-1">{resume.originalName}</p>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Right */}
//           <div className="space-y-4">
//             {/* ATS Score */}
//             <div className="bg-[#111827] border border-white/10 rounded-xl p-5">
//               <div className="flex items-center gap-4 mb-4">
//                 <div className="w-20 h-20 rounded-full border-4 border-[#00D4AA]/40 flex flex-col items-center justify-center flex-shrink-0">
//                  <p className="text-[#00D4AA] text-2xl font-bold leading-none">
//                   {analysis ? analysis.overallScore : resume ? "?" : "--"}
//                 </p>
//                   <p className="text-[#94A3B8] text-[9px]">ATS SCORE</p>
//                 </div>
//                 <div>
//                   <p className="text-white font-semibold mb-1">Optimization Status</p>
//                   {resume ? (
//                     <>
//                       <p className="text-[#94A3B8] text-xs mb-2">
//                         Your resume is in the <span className="text-[#00D4AA] font-semibold">Top 5%</span> of applicants for your target roles.
//                       </p>
//                      <div className="flex gap-2 flex-wrap">
//                         {analysis ? (
//                           <>
//                             <span className="bg-[#00D4AA]/20 text-[#00D4AA] text-[10px] px-2 py-0.5 rounded-full">Analyzed</span>
//                             <span className="bg-[#0099FF]/20 text-[#0099FF] text-[10px] px-2 py-0.5 rounded-full">Score: {analysis.overallScore}/100</span>
//                           </>
//                         ) : (
//                           <button
//                             onClick={handleAnalyze}
//                             disabled={analyzing}
//                             className="bg-gradient-to-r from-[#00D4AA] to-[#0099FF] text-white text-[10px] px-3 py-1 rounded-full hover:opacity-90 transition disabled:opacity-60"
//                           >
//                             {analyzing ? "Analyzing..." : "✨ Analyze Now"}
//                           </button>
//                         )}
//                       </div>
//                     </>
//                   ) : (
//                     <p className="text-[#94A3B8] text-xs">Upload your resume to get your ATS score and recommendations.</p>
//                   )}
//                 </div>
//               </div>

//               <div className="space-y-3">
//                 {scores.map((s) => (
//                   <div key={s.label}>
//                     <div className="flex items-center justify-between mb-1">
//                       <p className="text-[#94A3B8] text-xs">{s.label}</p>
//                       <p className="text-white text-xs font-semibold">{resume ? `${s.value}%` : "--"}</p>
//                     </div>
//                     <div className="h-1.5 bg-white/10 rounded-full">
//                       <div
//                         className="h-1.5 rounded-full transition-all duration-500"
//                         style={{
//                           width: resume ? `${s.value}%` : "0%",
//                           backgroundColor: s.value >= 85 ? "#00D4AA" : s.value >= 70 ? "#FFB800" : "#FF4D6D"
//                         }}
//                       />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Recommendations */}
//             <div className="bg-[#111827] border border-white/10 rounded-xl p-5">
//               <p className="text-white text-sm font-semibold mb-3">✨ AI Recommendations</p>
             
//             {resume && analysis ? (
//                 <div className="space-y-3">
//                   {analysis.recommendations.map((r, i) => (
//                     <div key={i} className="flex gap-3">
//                       <span className="text-sm mt-0.5">{r.icon}</span>
//                       <div>
//                         <p className="text-white text-xs font-medium mb-0.5">{r.title}</p>
//                         <p className="text-[#94A3B8] text-[10px] leading-relaxed">{r.desc}</p>
//                       </div>
//                     </div>
//                   ))}
//                 <button
//                     onClick={handleAnalyze}
//                     disabled={analyzing}
//                     className="w-full mt-2 bg-gradient-to-r from-[#00D4AA] to-[#0099FF] text-white text-xs font-semibold py-2.5 rounded-lg hover:opacity-90 transition disabled:opacity-60"
//                   >
//                     {analyzing ? "Analyzing..." : "🔄 Re-analyze Resume"}
//                   </button>
//                 </div>
//             ) : resume && !analysis ? (
//                 <div className="text-center py-4">
//                   <p className="text-[#94A3B8] text-xs mb-3">Click "Analyze Now" to get AI recommendations.</p>
//                   <button
//                     onClick={handleAnalyze}
//                     disabled={analyzing}
//                     className="bg-gradient-to-r from-[#00D4AA] to-[#0099FF] text-white text-xs font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition disabled:opacity-60"
//                   >
//                     {analyzing ? "Analyzing..." : "✨ Analyze Now"}
//                   </button>
//                 </div>
//               ) : (
//                 <p className="text-[#4B5563] text-xs text-center py-4">Upload a resume to see AI recommendations.</p>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </DashboardLayout>
//   )
// }


// client/src/pages/Resume.jsx
import { useState, useEffect } from "react"
import api from '../services/api'
import DashboardLayout from "../components/layout/DashboardLayout"

export default function Resume() {
  const [resume, setResume] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [selectedFile, setSelectedFile] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState(null)

  const scores = analysis ? [
    { label: "Keywords", value: analysis.scores.keywords },
    { label: "Formatting", value: analysis.scores.formatting },
    { label: "Readability", value: analysis.scores.readability },
    { label: "Skills Alignment", value: analysis.scores.skillsAlignment },
  ] : [
    { label: "Keywords", value: 0 },
    { label: "Formatting", value: 0 },
    { label: "Readability", value: 0 },
    { label: "Skills Alignment", value: 0 },
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resumeRes, analysisRes] = await Promise.all([
          api.get("/api/resume"),
          api.get("/api/resume/analysis"),
        ])
        if (resumeRes.data.resume) setResume(resumeRes.data.resume)
        if (analysisRes.data.analysis) setAnalysis(analysisRes.data.analysis)
      } catch (err) {
        console.error("Failed to fetch data", err)
      }
    }
    fetchData()
  }, [])

  const handleAnalyze = async () => {
    try {
      setAnalyzing(true)
      setError("")
      const res = await api.post("/api/resume/analyze", {})
      setAnalysis(res.data.analysis)
      setSuccess("Resume analyzed successfully!")
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError(err.response?.data?.message || "Analysis failed")
    } finally {
      setAnalyzing(false)
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      setError("")
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return
    setError("")
    setSuccess("")
    try {
      setUploading(true)
      const formData = new FormData()
      formData.append("resume", selectedFile)
      const res = await api.post("/api/resume/upload", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" }
      })
      setResume({
        url: res.data.resumeUrl,
        originalName: res.data.resumeOriginalName,
        uploadedAt: new Date(),
      })
      setSelectedFile(null)
      setSuccess("Resume uploaded successfully!")
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your resume?")) return
    try {
      setDeleting(true)
      await api.delete("/api/resume")
      setResume(null)
      setSuccess("Resume deleted.")
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError("Failed to delete resume")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <DashboardLayout title="Resume Analysis">
      <div>
        <h2 className="text-white text-xl sm:text-2xl font-bold mb-1">Resume Optimization</h2>
        <p className="text-[#94A3B8] text-xs sm:text-sm mb-4 sm:mb-6">
          AI-driven ATS analysis to maximize your landing rate.
        </p>

        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Left */}
          <div className="space-y-4">
            {/* Upload Zone */}
            <div
              className="bg-[#111827] border-2 border-dashed border-white/20 rounded-xl p-6 sm:p-8 text-center hover:border-[#00D4AA]/40 transition cursor-pointer"
              onClick={() => document.getElementById("resumeFileInput").click()}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#00D4AA]/10 flex items-center justify-center mx-auto mb-3 text-xl sm:text-2xl">
                📄
              </div>
              <p className="text-white font-semibold mb-1 text-sm sm:text-base truncate px-2">
                {selectedFile ? selectedFile.name : "Upload Resume"}
              </p>
              <p className="text-[#94A3B8] text-xs mb-4">
                Drop your PDF or DOCX here. Maximum file size: 5MB.
              </p>
              <input
                id="resumeFileInput"
                type="file"
                accept=".pdf,.docx,.doc"
                className="hidden"
                onChange={handleFileSelect}
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  document.getElementById("resumeFileInput").click()
                }}
                className="bg-gradient-to-r from-[#00D4AA] to-[#0099FF] text-white text-xs font-semibold px-5 sm:px-6 py-2 rounded-lg hover:opacity-90 transition"
              >
                Select File
              </button>
            </div>

            {selectedFile && (
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="w-full bg-gradient-to-r from-[#00D4AA] to-[#0099FF] text-white text-xs font-semibold py-2.5 rounded-lg hover:opacity-90 transition disabled:opacity-60"
              >
                {uploading ? "Uploading..." : "Upload Resume"}
              </button>
            )}

            {error && (
              <div className="bg-[#FF4D6D]/10 border border-[#FF4D6D]/30 text-[#FF4D6D] text-xs px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-[#00D4AA]/10 border border-[#00D4AA]/30 text-[#00D4AA] text-xs px-4 py-3 rounded-lg">
                {success}
              </div>
            )}

            {/* Current Resume */}
            {resume && (
              <div className="bg-[#111827] border border-white/10 rounded-xl p-4">
                <div className="flex items-start sm:items-center justify-between mb-3 gap-2">
                  <div className="min-w-0">
                    <p className="text-white text-xs font-semibold truncate">{resume.originalName}</p>
                    <p className="text-[#94A3B8] text-[10px]">
                      Uploaded{" "}
                      {resume.uploadedAt
                        ? new Date(resume.uploadedAt).toLocaleDateString()
                        : "recently"}
                    </p>
                  </div>
                  <div className="flex gap-3 flex-shrink-0">
                    <a
                      href={resume.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#00D4AA] text-xs hover:underline"
                    >
                      View
                    </a>
                    <button
                      onClick={handleDelete}
                      disabled={deleting}
                      className="text-[#FF4D6D] text-xs hover:underline disabled:opacity-60"
                    >
                      {deleting ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
                <div className="bg-[#0D1321] rounded-xl h-28 sm:h-36 flex items-center justify-center border border-white/5">
                  <div className="text-center">
                    <span className="text-2xl sm:text-3xl">📋</span>
                    <p className="text-[#94A3B8] text-xs mt-1 truncate px-4">{resume.originalName}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right */}
          <div className="space-y-4">
            {/* ATS Score */}
            <div className="bg-[#111827] border border-white/10 rounded-xl p-4 sm:p-5">
              <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-[#00D4AA]/40 flex flex-col items-center justify-center flex-shrink-0">
                  <p className="text-[#00D4AA] text-xl sm:text-2xl font-bold leading-none">
                    {analysis ? analysis.overallScore : resume ? "?" : "--"}
                  </p>
                  <p className="text-[#94A3B8] text-[8px] sm:text-[9px]">ATS SCORE</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm mb-1">Optimization Status</p>
                  {resume ? (
                    <>
                      <p className="text-[#94A3B8] text-xs mb-2 leading-relaxed">
                        Your resume is in the{" "}
                        <span className="text-[#00D4AA] font-semibold">Top 5%</span> of applicants
                        for your target roles.
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        {analysis ? (
                          <>
                            <span className="bg-[#00D4AA]/20 text-[#00D4AA] text-[10px] px-2 py-0.5 rounded-full">
                              Analyzed
                            </span>
                            <span className="bg-[#0099FF]/20 text-[#0099FF] text-[10px] px-2 py-0.5 rounded-full">
                              Score: {analysis.overallScore}/100
                            </span>
                          </>
                        ) : (
                          <button
                            onClick={handleAnalyze}
                            disabled={analyzing}
                            className="bg-gradient-to-r from-[#00D4AA] to-[#0099FF] text-white text-[10px] px-3 py-1 rounded-full hover:opacity-90 transition disabled:opacity-60"
                          >
                            {analyzing ? "Analyzing..." : "✨ Analyze Now"}
                          </button>
                        )}
                      </div>
                    </>
                  ) : (
                    <p className="text-[#94A3B8] text-xs">
                      Upload your resume to get your ATS score and recommendations.
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                {scores.map((s) => (
                  <div key={s.label}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-[#94A3B8] text-xs">{s.label}</p>
                      <p className="text-white text-xs font-semibold">
                        {resume ? `${s.value}%` : "--"}
                      </p>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full">
                      <div
                        className="h-1.5 rounded-full transition-all duration-500"
                        style={{
                          width: resume ? `${s.value}%` : "0%",
                          backgroundColor:
                            s.value >= 85
                              ? "#00D4AA"
                              : s.value >= 70
                              ? "#FFB800"
                              : "#FF4D6D",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-[#111827] border border-white/10 rounded-xl p-4 sm:p-5">
              <p className="text-white text-sm font-semibold mb-3">✨ AI Recommendations</p>

              {resume && analysis ? (
                <div className="space-y-3">
                  {analysis.recommendations.map((r, i) => (
                    <div key={i} className="flex gap-3">
                      <span className="text-sm mt-0.5 flex-shrink-0">{r.icon}</span>
                      <div className="min-w-0">
                        <p className="text-white text-xs font-medium mb-0.5">{r.title}</p>
                        <p className="text-[#94A3B8] text-[10px] leading-relaxed">{r.desc}</p>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={handleAnalyze}
                    disabled={analyzing}
                    className="w-full mt-2 bg-gradient-to-r from-[#00D4AA] to-[#0099FF] text-white text-xs font-semibold py-2.5 rounded-lg hover:opacity-90 transition disabled:opacity-60"
                  >
                    {analyzing ? "Analyzing..." : "🔄 Re-analyze Resume"}
                  </button>
                </div>
              ) : resume && !analysis ? (
                <div className="text-center py-4">
                  <p className="text-[#94A3B8] text-xs mb-3">
                    Click "Analyze Now" to get AI recommendations.
                  </p>
                  <button
                    onClick={handleAnalyze}
                    disabled={analyzing}
                    className="bg-gradient-to-r from-[#00D4AA] to-[#0099FF] text-white text-xs font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition disabled:opacity-60"
                  >
                    {analyzing ? "Analyzing..." : "✨ Analyze Now"}
                  </button>
                </div>
              ) : (
                <p className="text-[#4B5563] text-xs text-center py-4">
                  Upload a resume to see AI recommendations.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}