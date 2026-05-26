// // client/src/pages/Onboarding.jsx
// import { useState } from "react"
// import { useNavigate } from "react-router-dom"
// import api from '../services/api'

// const steps = ["Identity", "Preferences", "Resume"]

// export default function Onboarding() {
//   const [step, setStep] = useState(0)
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState("")
//   const navigate = useNavigate()

//   const [identity, setIdentity] = useState({
//     professionalTitle: "", location: "", bio: ""
//   })

//   const [preferences, setPreferences] = useState({
//     desiredTitles: "", preferredLocation: "",
//     salaryMin: "", salaryMax: "", workType: ""
//   })

//   const [resumeFile, setResumeFile] = useState(null)
//   const [resumeUploaded, setResumeUploaded] = useState(false)

//   const handleIdentityNext = async () => {
//     setError("")
//     try {
//       setLoading(true)
//       await api.put("/api/profile/identity", identity )
//       setStep(1)
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to save")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handlePreferencesNext = async () => {
//     setError("")
//     try {
//       setLoading(true)
//       await api.put("/api/profile/preferences", {
//         ...preferences,
//         desiredTitles: preferences.desiredTitles.split(",").map(t => t.trim()).filter(Boolean),
//         salaryMin: Number(preferences.salaryMin) || 0,
//         salaryMax: Number(preferences.salaryMax) || 0,
//       }, )
//       setStep(2)
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to save")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleResumeUpload = async () => {
//     if (!resumeFile) return
//     setError("")
//     try {
//       setLoading(true)
//       const formData = new FormData()
//       formData.append("resume", resumeFile)
//       await api.post("/api/resume/upload", formData, {
       
//         headers: { "Content-Type": "multipart/form-data" }
//       })
//       setResumeUploaded(true)
//     } catch (err) {
//       setError(err.response?.data?.message || "Upload failed")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleFinish = async () => {
//     try {
//       setLoading(true)
//       await api.put("/api/profile/complete-onboarding", {}, )
//       navigate("/dashboard")
//     } catch {
//       navigate("/dashboard")
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-[#0A0F1E] flex flex-col">
//       <div className="p-4 border-b border-white/5">
//         <p className="text-[#94A3B8] text-xs">Onboarding Wizard</p>
//       </div>

//       <div className="flex-1 flex items-center justify-center p-6">
//         <div className="w-full max-w-lg">
//           {/* Logo */}
//           <div className="text-center mb-6">
//             <div className="w-14 h-14 rounded-2xl bg-[#00D4AA]/20 flex items-center justify-center mx-auto mb-3 text-2xl">🚀</div>
//             <h1 className="text-white text-2xl font-bold">Setup your SmartHire Profile</h1>
//             <p className="text-[#94A3B8] text-sm mt-1">Complete your professional profile to let the AI Talent Engine start matching.</p>
//           </div>

//           {/* Step indicators */}
//           <div className="flex items-center mb-8">
//             {steps.map((s, i) => (
//               <div key={s} className="flex-1 flex flex-col items-center">
//                 <div className="flex items-center w-full">
//                   {i > 0 && <div className={`flex-1 h-px ${i <= step ? "bg-[#00D4AA]" : "bg-white/10"}`} />}
//                   <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition ${
//                     i === step ? "border-[#00D4AA] bg-[#00D4AA]/20 text-[#00D4AA]" :
//                     i < step ? "border-[#00D4AA] bg-[#00D4AA] text-white" :
//                     "border-white/20 text-[#94A3B8]"
//                   }`}>
//                     {i < step ? "✓" : i + 1}
//                   </div>
//                   {i < steps.length - 1 && <div className={`flex-1 h-px ${i < step ? "bg-[#00D4AA]" : "bg-white/10"}`} />}
//                 </div>
//                 <p className={`text-[10px] mt-1 ${i === step ? "text-[#00D4AA]" : "text-[#94A3B8]"}`}>{s}</p>
//               </div>
//             ))}
//           </div>

//           {/* Form Card */}
//           <div className="bg-[#111827] border border-white/10 rounded-2xl p-6">
//             {/* Step 1 — Identity */}
//             {step === 0 && (
//               <div className="space-y-4">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="text-[#94A3B8] text-xs mb-1 block">Professional Title</label>
//                     <input
//                       placeholder="e.g. Senior Software Engineer"
//                       value={identity.professionalTitle}
//                       onChange={(e) => setIdentity({ ...identity, professionalTitle: e.target.value })}
//                       className="w-full bg-white/5 border border-white/10 text-white text-sm placeholder-[#4B5563] rounded-lg py-2.5 px-3 focus:outline-none focus:border-[#00D4AA] transition"
//                     />
//                   </div>
//                   <div>
//                  <label className="text-[#94A3B8] text-xs mb-1 block">Current Location <span className="text-[#4B5563]">(where you live)</span></label>
//                     <div className="relative">
//                       <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] text-xs">📍</span>
//                       <input
//                         placeholder="City, Country"
//                         value={identity.location}
//                         onChange={(e) => setIdentity({ ...identity, location: e.target.value })}
//                         className="w-full bg-white/5 border border-white/10 text-white text-sm placeholder-[#4B5563] rounded-lg py-2.5 pl-8 pr-3 focus:outline-none focus:border-[#00D4AA] transition"
//                       />
//                     </div>
//                   </div>
//                 </div>
//                 <div>
//                   <label className="text-[#94A3B8] text-xs mb-1 block">Bio</label>
//                   <textarea
//                     placeholder="Briefly describe your career journey..."
//                     value={identity.bio}
//                     onChange={(e) => setIdentity({ ...identity, bio: e.target.value })}
//                     rows={4}
//                     className="w-full bg-white/5 border border-white/10 text-white text-sm placeholder-[#4B5563] rounded-lg py-2.5 px-3 focus:outline-none focus:border-[#00D4AA] transition resize-none"
//                   />
//                 </div>
//               </div>
//             )}

//             {/* Step 2 — Preferences */}
//             {step === 1 && (
//               <div className="space-y-4">
//                 <div>
//                   <label className="text-[#94A3B8] text-xs mb-1 block">Desired Job Titles <span className="text-[#4B5563]">(comma separated)</span></label>
//                   <input
//                     placeholder="e.g. Product Manager, UX Designer"
//                     value={preferences.desiredTitles}
//                     onChange={(e) => setPreferences({ ...preferences, desiredTitles: e.target.value })}
//                     className="w-full bg-white/5 border border-white/10 text-white text-sm placeholder-[#4B5563] rounded-lg py-2.5 px-3 focus:outline-none focus:border-[#00D4AA] transition"
//                   />
//                 </div>
//                 <div>
//                   <label className="text-[#94A3B8] text-xs mb-1 block">Preferred Location</label>
//                   <input
//                     placeholder="Remote, San Francisco, etc."
//                     value={preferences.preferredLocation}
//                     onChange={(e) => setPreferences({ ...preferences, preferredLocation: e.target.value })}
//                     className="w-full bg-white/5 border border-white/10 text-white text-sm placeholder-[#4B5563] rounded-lg py-2.5 px-3 focus:outline-none focus:border-[#00D4AA] transition"
//                   />
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="text-[#94A3B8] text-xs mb-1 block">Min Salary ($)</label>
//                     <input
//                       type="number"
//                       placeholder="e.g. 80000"
//                       value={preferences.salaryMin}
//                       onChange={(e) => setPreferences({ ...preferences, salaryMin: e.target.value })}
//                       className="w-full bg-white/5 border border-white/10 text-white text-sm placeholder-[#4B5563] rounded-lg py-2.5 px-3 focus:outline-none focus:border-[#00D4AA] transition"
//                     />
//                   </div>
//                   <div>
//                     <label className="text-[#94A3B8] text-xs mb-1 block">Max Salary ($)</label>
//                     <input
//                       type="number"
//                       placeholder="e.g. 150000"
//                       value={preferences.salaryMax}
//                       onChange={(e) => setPreferences({ ...preferences, salaryMax: e.target.value })}
//                       className="w-full bg-white/5 border border-white/10 text-white text-sm placeholder-[#4B5563] rounded-lg py-2.5 px-3 focus:outline-none focus:border-[#00D4AA] transition"
//                     />
//                   </div>
//                 </div>
//                 <div>
//                   <label className="text-[#94A3B8] text-xs mb-2 block">Work Type</label>
//                   <div className="flex gap-2">
//                     {["Remote", "Hybrid", "On-site"].map((t) => (
//                       <button
//                         key={t}
//                         type="button"
//                         onClick={() => setPreferences({ ...preferences, workType: t })}
//                         className={`flex-1 text-xs py-2 rounded-lg border transition ${
//                           preferences.workType === t
//                             ? "border-[#00D4AA] bg-[#00D4AA]/10 text-[#00D4AA]"
//                             : "border-white/10 text-[#94A3B8] hover:border-[#00D4AA]/50 hover:text-[#00D4AA]"
//                         }`}
//                       >
//                         {t}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Step 3 — Resume */}
//             {step === 2 && (
//               <div className="space-y-4">
//                 <div
//                   className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-[#00D4AA]/40 transition cursor-pointer"
//                   onClick={() => document.getElementById("resumeInput").click()}
//                 >
//                   <div className="text-3xl mb-2">{resumeUploaded ? "✅" : "📄"}</div>
//                   <p className="text-white text-sm font-semibold mb-1">
//                     {resumeFile ? resumeFile.name : "Upload Your Resume"}
//                   </p>
//                   <p className="text-[#94A3B8] text-xs mb-4">PDF or DOCX · Max 5MB</p>
//                   <input
//                     id="resumeInput"
//                     type="file"
//                     accept=".pdf,.docx,.doc"
//                     className="hidden"
//                     onChange={(e) => {
//                       setResumeFile(e.target.files[0])
//                       setResumeUploaded(false)
//                     }}
//                   />
//                   {!resumeUploaded && (
//                     <button
//                       type="button"
//                       onClick={(e) => {
//                         e.stopPropagation()
//                         document.getElementById("resumeInput").click()
//                       }}
//                       className="bg-gradient-to-r from-[#00D4AA] to-[#0099FF] text-white text-xs font-semibold px-6 py-2 rounded-lg hover:opacity-90 transition"
//                     >
//                       Select File
//                     </button>
//                   )}
//                 </div>

//                 {resumeFile && !resumeUploaded && (
//                   <button
//                     onClick={handleResumeUpload}
//                     disabled={loading}
//                     className="w-full bg-gradient-to-r from-[#00D4AA] to-[#0099FF] text-white text-xs font-semibold py-2.5 rounded-lg hover:opacity-90 transition disabled:opacity-60"
//                   >
//                     {loading ? "Uploading..." : "Upload Resume"}
//                   </button>
//                 )}

//                 {resumeUploaded && (
//                   <div className="bg-[#00D4AA]/10 border border-[#00D4AA]/30 text-[#00D4AA] text-xs px-4 py-3 rounded-lg text-center">
//                     ✓ Resume uploaded successfully!
//                   </div>
//                 )}

//                 <p className="text-[#94A3B8] text-xs text-center">
//                   You can skip this and upload later from the Resume page.
//                 </p>
//               </div>
//             )}

//             {error && (
//               <div className="mt-3 bg-[#FF4D6D]/10 border border-[#FF4D6D]/30 text-[#FF4D6D] text-xs px-4 py-3 rounded-lg">
//                 {error}
//               </div>
//             )}

//             {/* Footer */}
//             <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
//               <button
//                 onClick={() => step > 0 && setStep(step - 1)}
//                 className="flex items-center gap-1 text-[#94A3B8] text-xs hover:text-white transition"
//               >
//                 ← Back
//               </button>
//               <button className="text-[#94A3B8] text-xs hover:text-white transition">
//                 Save Draft
//               </button>
//               <button
//                 disabled={loading}
//                 onClick={() => {
//                   if (step === 0) handleIdentityNext()
//                   else if (step === 1) handlePreferencesNext()
//                   else handleFinish()
//                 }}
//                 className="bg-gradient-to-r from-[#00D4AA] to-[#0099FF] text-white text-xs font-semibold px-6 py-2 rounded-lg hover:opacity-90 transition disabled:opacity-60"
//               >
//                 {loading ? "Saving..." : step === 2 ? "Finish →" : "Continue →"}
//               </button>
//             </div>
//           </div>

//           <div className="flex items-center justify-between mt-4 px-2">
//             <div className="flex items-center gap-2">
//               <span className="text-lg">🤖</span>
//               <p className="text-[#94A3B8] text-xs">
//                 Need help? <span className="text-[#00D4AA] cursor-pointer hover:underline">Chat with a Talent Agent</span>
//               </p>
//             </div>
//             <p className="text-[#94A3B8] text-xs">© 2026 SmartHire AI</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }


// client/src/pages/Onboarding.jsx
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from '../services/api'

const steps = ["Identity", "Preferences", "Resume"]

export default function Onboarding() {
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const [identity, setIdentity] = useState({
    professionalTitle: "", location: "", bio: ""
  })

  const [preferences, setPreferences] = useState({
    desiredTitles: "", preferredLocation: "",
    salaryMin: "", salaryMax: "", workType: ""
  })

  const [resumeFile, setResumeFile] = useState(null)
  const [resumeUploaded, setResumeUploaded] = useState(false)

  const handleIdentityNext = async () => {
    setError("")
    try {
      setLoading(true)
      await api.put("/api/profile/identity", identity)
      setStep(1)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save")
    } finally {
      setLoading(false)
    }
  }

  const handlePreferencesNext = async () => {
    setError("")
    try {
      setLoading(true)
      await api.put("/api/profile/preferences", {
        ...preferences,
        desiredTitles: preferences.desiredTitles.split(",").map(t => t.trim()).filter(Boolean),
        salaryMin: Number(preferences.salaryMin) || 0,
        salaryMax: Number(preferences.salaryMax) || 0,
      })
      setStep(2)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save")
    } finally {
      setLoading(false)
    }
  }

  const handleResumeUpload = async () => {
    if (!resumeFile) return
    setError("")
    try {
      setLoading(true)
      const formData = new FormData()
      formData.append("resume", resumeFile)
      await api.post("/api/resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      setResumeUploaded(true)
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed")
    } finally {
      setLoading(false)
    }
  }

  const handleFinish = async () => {
    try {
      setLoading(true)
      await api.put("/api/profile/complete-onboarding", {})
      navigate("/dashboard")
    } catch {
      navigate("/dashboard")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0F1E] flex flex-col">
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">🚀</span>
          <span className="text-white font-bold text-sm">SmartHire</span>
        </div>
        <p className="text-[#94A3B8] text-xs">Step {step + 1} of {steps.length}</p>
      </div>

      <div className="flex-1 flex items-start sm:items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-lg">
          {/* Logo */}
          <div className="text-center mb-5 sm:mb-6">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#00D4AA]/20 flex items-center justify-center mx-auto mb-3 text-xl sm:text-2xl">🚀</div>
            <h1 className="text-white text-xl sm:text-2xl font-bold">Setup your SmartHire Profile</h1>
            <p className="text-[#94A3B8] text-xs sm:text-sm mt-1 px-2">
              Complete your professional profile to let the AI Talent Engine start matching.
            </p>
          </div>

          {/* Step indicators */}
          <div className="flex items-center mb-6 sm:mb-8">
            {steps.map((s, i) => (
              <div key={s} className="flex-1 flex flex-col items-center">
                <div className="flex items-center w-full">
                  {i > 0 && <div className={`flex-1 h-px ${i <= step ? "bg-[#00D4AA]" : "bg-white/10"}`} />}
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition ${
                    i === step ? "border-[#00D4AA] bg-[#00D4AA]/20 text-[#00D4AA]" :
                    i < step ? "border-[#00D4AA] bg-[#00D4AA] text-white" :
                    "border-white/20 text-[#94A3B8]"
                  }`}>
                    {i < step ? "✓" : i + 1}
                  </div>
                  {i < steps.length - 1 && <div className={`flex-1 h-px ${i < step ? "bg-[#00D4AA]" : "bg-white/10"}`} />}
                </div>
                <p className={`text-[9px] sm:text-[10px] mt-1 ${i === step ? "text-[#00D4AA]" : "text-[#94A3B8]"}`}>{s}</p>
              </div>
            ))}
          </div>

          {/* Form Card */}
          <div className="bg-[#111827] border border-white/10 rounded-2xl p-4 sm:p-6">
            {/* Step 1 — Identity */}
            {step === 0 && (
              <div className="space-y-4">
                {/* Stacks to 1 col on mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[#94A3B8] text-xs mb-1 block">Professional Title</label>
                    <input
                      placeholder="e.g. Senior Software Engineer"
                      value={identity.professionalTitle}
                      onChange={(e) => setIdentity({ ...identity, professionalTitle: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 text-white text-sm placeholder-[#4B5563] rounded-lg py-2.5 px-3 focus:outline-none focus:border-[#00D4AA] transition"
                    />
                  </div>
                  <div>
                    <label className="text-[#94A3B8] text-xs mb-1 block">
                      Current Location <span className="text-[#4B5563]">(where you live)</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] text-xs">📍</span>
                      <input
                        placeholder="City, Country"
                        value={identity.location}
                        onChange={(e) => setIdentity({ ...identity, location: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 text-white text-sm placeholder-[#4B5563] rounded-lg py-2.5 pl-8 pr-3 focus:outline-none focus:border-[#00D4AA] transition"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-[#94A3B8] text-xs mb-1 block">Bio</label>
                  <textarea
                    placeholder="Briefly describe your career journey..."
                    value={identity.bio}
                    onChange={(e) => setIdentity({ ...identity, bio: e.target.value })}
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 text-white text-sm placeholder-[#4B5563] rounded-lg py-2.5 px-3 focus:outline-none focus:border-[#00D4AA] transition resize-none"
                  />
                </div>
              </div>
            )}

            {/* Step 2 — Preferences */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="text-[#94A3B8] text-xs mb-1 block">
                    Desired Job Titles <span className="text-[#4B5563]">(comma separated)</span>
                  </label>
                  <input
                    placeholder="e.g. Product Manager, UX Designer"
                    value={preferences.desiredTitles}
                    onChange={(e) => setPreferences({ ...preferences, desiredTitles: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 text-white text-sm placeholder-[#4B5563] rounded-lg py-2.5 px-3 focus:outline-none focus:border-[#00D4AA] transition"
                  />
                </div>
                <div>
                  <label className="text-[#94A3B8] text-xs mb-1 block">Preferred Location</label>
                  <input
                    placeholder="Remote, San Francisco, etc."
                    value={preferences.preferredLocation}
                    onChange={(e) => setPreferences({ ...preferences, preferredLocation: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 text-white text-sm placeholder-[#4B5563] rounded-lg py-2.5 px-3 focus:outline-none focus:border-[#00D4AA] transition"
                  />
                </div>
                {/* Salary — stacks on mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[#94A3B8] text-xs mb-1 block">Min Salary ($)</label>
                    <input
                      type="number"
                      placeholder="e.g. 80000"
                      value={preferences.salaryMin}
                      onChange={(e) => setPreferences({ ...preferences, salaryMin: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 text-white text-sm placeholder-[#4B5563] rounded-lg py-2.5 px-3 focus:outline-none focus:border-[#00D4AA] transition"
                    />
                  </div>
                  <div>
                    <label className="text-[#94A3B8] text-xs mb-1 block">Max Salary ($)</label>
                    <input
                      type="number"
                      placeholder="e.g. 150000"
                      value={preferences.salaryMax}
                      onChange={(e) => setPreferences({ ...preferences, salaryMax: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 text-white text-sm placeholder-[#4B5563] rounded-lg py-2.5 px-3 focus:outline-none focus:border-[#00D4AA] transition"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[#94A3B8] text-xs mb-2 block">Work Type</label>
                  <div className="flex gap-2">
                    {["Remote", "Hybrid", "On-site"].map((t) => (
                      <button key={t} type="button"
                        onClick={() => setPreferences({ ...preferences, workType: t })}
                        className={`flex-1 text-xs py-2.5 rounded-lg border transition ${
                          preferences.workType === t
                            ? "border-[#00D4AA] bg-[#00D4AA]/10 text-[#00D4AA]"
                            : "border-white/10 text-[#94A3B8] hover:border-[#00D4AA]/50 hover:text-[#00D4AA]"
                        }`}
                      >{t}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3 — Resume */}
            {step === 2 && (
              <div className="space-y-4">
                <div
                  className="border-2 border-dashed border-white/20 rounded-xl p-6 sm:p-8 text-center hover:border-[#00D4AA]/40 transition cursor-pointer"
                  onClick={() => document.getElementById("resumeInput").click()}
                >
                  <div className="text-3xl mb-2">{resumeUploaded ? "✅" : "📄"}</div>
                  <p className="text-white text-sm font-semibold mb-1">
                    {resumeFile ? resumeFile.name : "Upload Your Resume"}
                  </p>
                  <p className="text-[#94A3B8] text-xs mb-4">PDF or DOCX · Max 5MB</p>
                  <input
                    id="resumeInput"
                    type="file"
                    accept=".pdf,.docx,.doc"
                    className="hidden"
                    onChange={(e) => {
                      setResumeFile(e.target.files[0])
                      setResumeUploaded(false)
                    }}
                  />
                  {!resumeUploaded && (
                    <button type="button"
                      onClick={(e) => { e.stopPropagation(); document.getElementById("resumeInput").click() }}
                      className="bg-gradient-to-r from-[#00D4AA] to-[#0099FF] text-white text-xs font-semibold px-6 py-2 rounded-lg hover:opacity-90 transition"
                    >
                      Select File
                    </button>
                  )}
                </div>

                {resumeFile && !resumeUploaded && (
                  <button onClick={handleResumeUpload} disabled={loading}
                    className="w-full bg-gradient-to-r from-[#00D4AA] to-[#0099FF] text-white text-xs font-semibold py-2.5 rounded-lg hover:opacity-90 transition disabled:opacity-60">
                    {loading ? "Uploading..." : "Upload Resume"}
                  </button>
                )}

                {resumeUploaded && (
                  <div className="bg-[#00D4AA]/10 border border-[#00D4AA]/30 text-[#00D4AA] text-xs px-4 py-3 rounded-lg text-center">
                    ✓ Resume uploaded successfully!
                  </div>
                )}

                <p className="text-[#94A3B8] text-xs text-center">
                  You can skip this and upload later from the Resume page.
                </p>
              </div>
            )}

            {error && (
              <div className="mt-3 bg-[#FF4D6D]/10 border border-[#FF4D6D]/30 text-[#FF4D6D] text-xs px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
              <button
                onClick={() => step > 0 && setStep(step - 1)}
                disabled={step === 0}
                className="flex items-center gap-1 text-[#94A3B8] text-xs hover:text-white transition disabled:opacity-30"
              >
                ← Back
              </button>
              <button className="text-[#94A3B8] text-xs hover:text-white transition">
                Save Draft
              </button>
              <button
                disabled={loading}
                onClick={() => {
                  if (step === 0) handleIdentityNext()
                  else if (step === 1) handlePreferencesNext()
                  else handleFinish()
                }}
                className="bg-gradient-to-r from-[#00D4AA] to-[#0099FF] text-white text-xs font-semibold px-5 py-2 rounded-lg hover:opacity-90 transition disabled:opacity-60"
              >
                {loading ? "Saving..." : step === 2 ? "Finish →" : "Continue →"}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 px-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">🤖</span>
              <p className="text-[#94A3B8] text-xs">
                Need help?{" "}
                <span className="text-[#00D4AA] cursor-pointer hover:underline">Chat with a Talent Agent</span>
              </p>
            </div>
            <p className="text-[#94A3B8] text-xs hidden sm:block">© 2026 SmartHire AI</p>
          </div>
        </div>
      </div>
    </div>
  )
}