// // client/src/pages/Profile.jsx
// import { useState, useEffect } from "react"
// import api from '../services/api'
// import DashboardLayout from "../components/layout/DashboardLayout"
// import { useAuth } from "../context/AuthContext"

// const tabs = ["Profile", "Preferences", "Resume", "Account"]

// export default function Profile() {
//   const [activeTab, setActiveTab] = useState("Profile")
//   const { user } = useAuth()
//   const [loading, setLoading] = useState(false)
//   const [fetchLoading, setFetchLoading] = useState(true)
//   const [success, setSuccess] = useState("")
//   const [error, setError] = useState("")
//   const [newSkill, setNewSkill] = useState("")
//   const [newLocation, setNewLocation] = useState("")
//   const [newTitle, setNewTitle] = useState("")
//   const [avatarLoading, setAvatarLoading] = useState(false)

//   const [profile, setProfile] = useState({
//     professionalTitle: "",
//     location: "",
//     bio: "",
//     skills: [],
//     desiredTitles: [],
//     preferredLocation: "",
//     preferredLocations: [],
//     salaryMin: "",
//     salaryMax: "",
//     workType: "",
//     avatarUrl: "",
//     resumeUrl: "",
//     resumeOriginalName: "",
//     resumeUploadedAt: null,
//     atsScore: 0,
//     atsTopSkillsFound: [],
//   })

//   const [firstName, setFirstName] = useState("")
//   const [lastName, setLastName] = useState("")

//   useEffect(() => {
//     if (user?.fullName) {
//       const parts = user.fullName.split(" ")
//       setFirstName(parts[0] || "")
//       setLastName(parts.slice(1).join(" ") || "")
//     }
//   }, [user])

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const res = await api.get("/api/profile" )
//         const p = res.data.profile
//         setProfile({
//           professionalTitle: p.professionalTitle || "",
//           location: p.location || "",
//           bio: p.bio || "",
//         skills: [...new Set([...(p.skills || []), ...(p.atsTopSkillsFound || [])])],
//           desiredTitles: p.desiredTitles || [],
//           preferredLocation: p.preferredLocation || "",
//           preferredLocations: p.preferredLocations || [],
//           salaryMin: p.salaryMin || "",
//           salaryMax: p.salaryMax || "",
//           workType: p.workType || "",
//           avatarUrl: p.avatarUrl || "",
//           resumeUrl: p.resumeUrl || "",
//           resumeOriginalName: p.resumeOriginalName || "",
//           resumeUploadedAt: p.resumeUploadedAt || null,
//           atsScore: p.atsScore || 0,
//           atsTopSkillsFound: p.atsTopSkillsFound || [],
//         })
//       } catch (err) {
//         console.error("Failed to fetch profile", err)
//       } finally {
//         setFetchLoading(false)
//       }
//     }
//     fetchProfile()
//   }, [])

//   const handleSave = async () => {
//     setError("")
//     setSuccess("")
//     try {
//       setLoading(true)
//       const fullName = `${firstName} ${lastName}`.trim()
//       await api.put(
//         "/api/profile/save",
//         { ...profile, fullName },
        
//       )
//       setSuccess("Profile saved successfully!")
//       setTimeout(() => setSuccess(""), 3000)
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to save")
//     } finally {
//       setLoading(false)
//     }
//   }

//   // --- Skills ---
//   const handleAddSkill = () => {
//     const trimmed = newSkill.trim()
//     if (trimmed && !profile.skills.includes(trimmed)) {
//       setProfile({ ...profile, skills: [...profile.skills, trimmed] })
//       setNewSkill("")
//     }
//   }
//   const handleRemoveSkill = (skill) =>
//     setProfile({ ...profile, skills: profile.skills.filter((s) => s !== skill) })

//   // --- Preferred Locations ---
//   const handleAddLocation = () => {
//     const trimmed = newLocation.trim()
//     if (trimmed && !profile.preferredLocations.includes(trimmed)) {
//       setProfile({ ...profile, preferredLocations: [...profile.preferredLocations, trimmed] })
//       setNewLocation("")
//     }
//   }
//   const handleRemoveLocation = (loc) =>
//     setProfile({ ...profile, preferredLocations: profile.preferredLocations.filter((l) => l !== loc) })

//   // --- Desired Titles ---
//   const handleAddTitle = () => {
//     const trimmed = newTitle.trim()
//     if (trimmed && !profile.desiredTitles.includes(trimmed)) {
//       setProfile({ ...profile, desiredTitles: [...profile.desiredTitles, trimmed] })
//       setNewTitle("")
//     }
//   }
//   const handleRemoveTitle = (title) =>
//     setProfile({ ...profile, desiredTitles: profile.desiredTitles.filter((t) => t !== title) })

//   // --- Avatar ---
//   const handleAvatarUpload = async (e) => {
//     const file = e.target.files[0]
//     if (!file) return
//     try {
//       setAvatarLoading(true)
//       const formData = new FormData()
//       formData.append("avatar", file)
//       const res = await api.post("/api/profile/avatar", formData, {
       
//         headers: { "Content-Type": "multipart/form-data" },
//       })
//       setProfile({ ...profile, avatarUrl: res.data.avatarUrl })
//     } catch (err) {
//       setError("Failed to upload image")
//     } finally {
//       setAvatarLoading(false)
//     }
//   }

//   const formatDate = (dateStr) => {
//     if (!dateStr) return "—"
//     return new Date(dateStr).toLocaleDateString("en-US", {
//       month: "short", day: "numeric", year: "numeric",
//     })
//   }

//   const getScoreColor = (score) => {
//     if (score >= 80) return "#00D4AA"
//     if (score >= 60) return "#FFB800"
//     return "#FF4D6D"
//   }

//   // --- Reusable Save Footer ---
//   const SaveFooter = () => (
//     <div className="space-y-3">
//       {error && (
//         <div className="bg-[#FF4D6D]/10 border border-[#FF4D6D]/30 text-[#FF4D6D] text-xs px-4 py-3 rounded-lg">
//           {error}
//         </div>
//       )}
//       {success && (
//         <div className="bg-[#00D4AA]/10 border border-[#00D4AA]/30 text-[#00D4AA] text-xs px-4 py-3 rounded-lg">
//           {success}
//         </div>
//       )}
//       <div className="flex justify-end gap-3">
//         <button
//           onClick={() => window.location.reload()}
//           className="text-[#94A3B8] text-xs px-4 py-2 rounded-lg border border-white/10 hover:text-white transition"
//         >
//           Discard Changes
//         </button>
//         <button
//           onClick={handleSave}
//           disabled={loading}
//           className="bg-gradient-to-r from-[#00D4AA] to-[#0099FF] text-white text-xs font-semibold px-6 py-2 rounded-lg hover:opacity-90 transition disabled:opacity-60"
//         >
//           {loading ? "Saving..." : "💾 Save Changes"}
//         </button>
//       </div>
//     </div>
//   )

//   if (fetchLoading)
//     return (
//       <DashboardLayout title="Profile & Settings">
//         <div className="flex items-center justify-center h-64">
//           <div className="text-[#00D4AA]">Loading profile...</div>
//         </div>
//       </DashboardLayout>
//     )

//   return (
//     <DashboardLayout title="Profile & Settings">
//       <div>
//         <h2 className="text-white text-2xl font-bold mb-1">Account Settings</h2>
//         <p className="text-[#94A3B8] text-sm mb-6">
//           Manage your professional profile and application preferences.
//         </p>

//         {/* Tabs */}
//         <div className="flex gap-1 border-b border-white/10 mb-6">
//           {tabs.map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab)}
//               className={`px-4 py-2 text-sm transition border-b-2 -mb-px ${
//                 activeTab === tab
//                   ? "border-[#00D4AA] text-[#00D4AA]"
//                   : "border-transparent text-[#94A3B8] hover:text-white"
//               }`}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>

//         {/* ── PROFILE TAB ── */}
//         {activeTab === "Profile" && (
//           <div className="grid grid-cols-3 gap-6">
//             {/* Avatar Card */}
//             <div className="bg-[#111827] border border-white/10 rounded-xl p-6 flex flex-col items-center text-center h-fit">
//               <div className="relative mb-4">
//                 {profile.avatarUrl ? (
//                   <img
//                     src={profile.avatarUrl}
//                     alt="Avatar"
//                     className="w-24 h-24 rounded-full object-cover border-2 border-[#00D4AA]/30"
//                   />
//                 ) : (
//                   <div className="w-24 h-24 rounded-full bg-[#00D4AA]/20 flex items-center justify-center text-4xl border-2 border-[#00D4AA]/30">
//                     {user?.fullName?.charAt(0) || "👤"}
//                   </div>
//                 )}
//                 <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#00D4AA] flex items-center justify-center text-[10px]">
//                   ✓
//                 </div>
//               </div>
//               <p className="text-white font-bold text-lg">{user?.fullName}</p>
//               <p className="text-[#94A3B8] text-xs mb-1">
//                 {profile.professionalTitle || "Add your title"}
//               </p>
//               <p className="text-[#94A3B8] text-[10px] mb-1">{profile.location || ""}</p>
//               <p className="text-[#4B5563] text-[10px] mb-3">JPG, GIF or PNG. Max 800KB</p>
//               <input
//                 id="avatarInput"
//                 type="file"
//                 accept="image/*"
//                 className="hidden"
//                 onChange={handleAvatarUpload}
//               />
//               <button
//                 onClick={() => document.getElementById("avatarInput").click()}
//                 disabled={avatarLoading}
//                 className="w-full bg-white/5 border border-white/10 text-white text-xs py-2 rounded-lg hover:bg-white/10 transition disabled:opacity-60"
//               >
//                 {avatarLoading ? "Uploading..." : "Upload New Image"}
//               </button>

//               {/* ATS score preview */}
//               {profile.atsScore > 0 && (
//                 <div className="mt-4 w-full bg-[#0D1321] rounded-xl p-3 text-left">
//                   <p className="text-[#94A3B8] text-[10px] mb-1">ATS SCORE</p>
//                   <p className="font-bold text-xl" style={{ color: getScoreColor(profile.atsScore) }}>
//                     {profile.atsScore}
//                     <span className="text-xs text-[#94A3B8]">/100</span>
//                   </p>
//                   <div className="w-full h-1.5 bg-white/10 rounded-full mt-2">
//                     <div
//                       className="h-1.5 rounded-full"
//                       style={{
//                         width: `${profile.atsScore}%`,
//                         backgroundColor: getScoreColor(profile.atsScore),
//                       }}
//                     />
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Right — Personal Info + Skills */}
//             <div className="col-span-2 space-y-4">
//               {/* Personal Info */}
//               <div className="bg-[#111827] border border-white/10 rounded-xl p-5">
//                 <p className="text-[#94A3B8] text-xs font-medium mb-4">🗂 Personal Information</p>
//                 <div className="grid grid-cols-2 gap-4 mb-4">
//                   <div>
//                     <label className="text-[#94A3B8] text-xs mb-1 block">First Name</label>
//                     <input
//                       value={firstName}
//                       onChange={(e) => setFirstName(e.target.value)}
//                       className="w-full bg-white/5 border border-white/10 text-white text-xs rounded-lg py-2.5 px-3 focus:outline-none focus:border-[#00D4AA] transition"
//                     />
//                   </div>
//                   <div>
//                     <label className="text-[#94A3B8] text-xs mb-1 block">Last Name</label>
//                     <input
//                       value={lastName}
//                       onChange={(e) => setLastName(e.target.value)}
//                       className="w-full bg-white/5 border border-white/10 text-white text-xs rounded-lg py-2.5 px-3 focus:outline-none focus:border-[#00D4AA] transition"
//                     />
//                   </div>
//                 </div>

//                 <div className="mb-4">
//                   <label className="text-[#94A3B8] text-xs mb-1 block">Email Address</label>
//                   <input
//                     value={user?.email || ""}
//                     disabled
//                     className="w-full bg-white/5 border border-white/10 text-[#94A3B8] text-xs rounded-lg py-2.5 px-3 opacity-60 cursor-not-allowed"
//                   />
//                 </div>

//                 <div className="mb-4">
//                   <label className="text-[#94A3B8] text-xs mb-1 block">Professional Title</label>
//                   <input
//                     value={profile.professionalTitle}
//                     onChange={(e) => setProfile({ ...profile, professionalTitle: e.target.value })}
//                     placeholder="e.g. Senior Software Engineer"
//                     className="w-full bg-white/5 border border-white/10 text-white text-xs rounded-lg py-2.5 px-3 focus:outline-none focus:border-[#00D4AA] transition"
//                   />
//                 </div>

//                 <div className="mb-4">
//                   <label className="text-[#94A3B8] text-xs mb-1 block">
//                     Current Location{" "}
//                     <span className="text-[#4B5563]">(where you live)</span>
//                   </label>
//                   <input
//                     value={profile.location}
//                     onChange={(e) => setProfile({ ...profile, location: e.target.value })}
//                     placeholder="e.g. Hyderabad, India"
//                     className="w-full bg-white/5 border border-white/10 text-white text-xs rounded-lg py-2.5 px-3 focus:outline-none focus:border-[#00D4AA] transition"
//                   />
//                 </div>

//                 <div>
//                   <label className="text-[#94A3B8] text-xs mb-1 block">Professional Bio</label>
//                   <textarea
//                     value={profile.bio}
//                     onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
//                     rows={3}
//                     placeholder="Briefly describe your career journey..."
//                     className="w-full bg-white/5 border border-white/10 text-white text-xs rounded-lg py-2.5 px-3 focus:outline-none focus:border-[#00D4AA] transition resize-none"
//                   />
//                 </div>
//               </div>

//               {/* Skills */}
//               <div className="bg-[#111827] border border-white/10 rounded-xl p-5">
//                 <div className="flex items-center justify-between mb-3">
//                   <p className="text-[#94A3B8] text-xs font-medium">⚡ Core Skills</p>
//                   {profile.atsTopSkillsFound.length > 0 && (
//                     <p className="text-[#4B5563] text-[10px]">
//                       {profile.atsTopSkillsFound.length} skills detected from resume
//                     </p>
//                   )}
//                 </div>
//                 <div className="flex gap-2 mb-3">
//                   <input
//                     value={newSkill}
//                     onChange={(e) => setNewSkill(e.target.value)}
//                     onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
//                     placeholder="Type a skill and press Enter"
//                     className="flex-1 bg-white/5 border border-white/10 text-white text-xs rounded-lg py-2 px-3 focus:outline-none focus:border-[#00D4AA] transition"
//                   />
//                   <button
//                     onClick={handleAddSkill}
//                     className="bg-[#00D4AA]/10 border border-[#00D4AA]/30 text-[#00D4AA] text-xs px-3 py-2 rounded-lg hover:bg-[#00D4AA]/20 transition"
//                   >
//                     + Add
//                   </button>
//                 </div>
//                 <div className="flex flex-wrap gap-2">
//                   {profile.skills.map((skill) => (
//                     <span
//                       key={skill}
//                       className="bg-[#00D4AA]/10 border border-[#00D4AA]/20 text-[#00D4AA] text-xs px-3 py-1 rounded-full flex items-center gap-1"
//                     >
//                       {skill}
//                       <button
//                         onClick={() => handleRemoveSkill(skill)}
//                         className="text-[#00D4AA]/60 hover:text-[#FF4D6D] ml-1"
//                       >
//                         ×
//                       </button>
//                     </span>
//                   ))}
//                   {profile.skills.length === 0 && (
//                     <p className="text-[#4B5563] text-xs">
//                       No skills added yet. Type above or analyze your resume.
//                     </p>
//                   )}
//                 </div>
//               </div>

//               <SaveFooter />
//             </div>
//           </div>
//         )}

//         {/* ── PREFERENCES TAB ── */}
//         {activeTab === "Preferences" && (
//           <div className="grid grid-cols-3 gap-6">
//             <div className="col-span-2 space-y-4">
//               {/* Desired Job Titles */}
//               <div className="bg-[#111827] border border-white/10 rounded-xl p-5">
//                 <p className="text-[#94A3B8] text-xs font-medium mb-1">🎯 Desired Job Titles</p>
//                 <p className="text-[#4B5563] text-[10px] mb-3">
//                   Used by the Daily Job Digest to find matching opportunities.
//                 </p>
//                 <div className="flex gap-2 mb-3">
//                   <input
//                     value={newTitle}
//                     onChange={(e) => setNewTitle(e.target.value)}
//                     onKeyDown={(e) => e.key === "Enter" && handleAddTitle()}
//                     placeholder="e.g. Full Stack Developer, React Developer..."
//                     className="flex-1 bg-white/5 border border-white/10 text-white text-xs rounded-lg py-2 px-3 focus:outline-none focus:border-[#00D4AA] transition"
//                   />
//                   <button
//                     onClick={handleAddTitle}
//                     className="bg-[#00D4AA]/10 border border-[#00D4AA]/30 text-[#00D4AA] text-xs px-3 py-2 rounded-lg hover:bg-[#00D4AA]/20 transition"
//                   >
//                     + Add
//                   </button>
//                 </div>
//                 <div className="flex flex-wrap gap-2">
//                   {profile.desiredTitles.map((title) => (
//                     <span
//                       key={title}
//                       className="bg-[#0099FF]/10 border border-[#0099FF]/20 text-[#0099FF] text-xs px-3 py-1 rounded-full flex items-center gap-1"
//                     >
//                       🎯 {title}
//                       <button
//                         onClick={() => handleRemoveTitle(title)}
//                         className="text-[#0099FF]/60 hover:text-[#FF4D6D] ml-1"
//                       >
//                         ×
//                       </button>
//                     </span>
//                   ))}
//                   {profile.desiredTitles.length === 0 && (
//                     <p className="text-[#4B5563] text-xs">
//                       Add at least one job title to power your daily digest.
//                     </p>
//                   )}
//                 </div>
//               </div>

//               {/* Preferred Locations */}
//               <div className="bg-[#111827] border border-white/10 rounded-xl p-5">
//                 <p className="text-[#94A3B8] text-xs font-medium mb-1">📍 Preferred Job Locations</p>
//                 <p className="text-[#4B5563] text-[10px] mb-3">
//                   Where you want to work — different from where you currently live.
//                 </p>
//                 <div className="flex gap-2 mb-3">
//                   <input
//                     value={newLocation}
//                     onChange={(e) => setNewLocation(e.target.value)}
//                     onKeyDown={(e) => e.key === "Enter" && handleAddLocation()}
//                     placeholder="e.g. Remote, Bangalore, Hyderabad, US..."
//                     className="flex-1 bg-white/5 border border-white/10 text-white text-xs rounded-lg py-2 px-3 focus:outline-none focus:border-[#00D4AA] transition"
//                   />
//                   <button
//                     onClick={handleAddLocation}
//                     className="bg-[#00D4AA]/10 border border-[#00D4AA]/30 text-[#00D4AA] text-xs px-3 py-2 rounded-lg hover:bg-[#00D4AA]/20 transition"
//                   >
//                     + Add
//                   </button>
//                 </div>
//                 <div className="flex flex-wrap gap-2">
//                   {profile.preferredLocations.map((loc) => (
//                     <span
//                       key={loc}
//                       className="bg-[#00D4AA]/10 border border-[#00D4AA]/20 text-[#00D4AA] text-xs px-3 py-1 rounded-full flex items-center gap-1"
//                     >
//                       📍 {loc}
//                       <button
//                         onClick={() => handleRemoveLocation(loc)}
//                         className="text-[#00D4AA]/60 hover:text-[#FF4D6D] ml-1"
//                       >
//                         ×
//                       </button>
//                     </span>
//                   ))}
//                   {profile.preferredLocations.length === 0 && (
//                     <p className="text-[#4B5563] text-xs">Add your preferred work locations.</p>
//                   )}
//                 </div>
//               </div>

//               {/* Salary + Work Type */}
//               <div className="bg-[#111827] border border-white/10 rounded-xl p-5">
//                 <p className="text-[#94A3B8] text-xs font-medium mb-4">💰 Salary & Work Preference</p>
//                 <div className="grid grid-cols-2 gap-4 mb-4">
//                   <div>
//                     <label className="text-[#94A3B8] text-xs mb-1 block">
//                       Min Salary{" "}
//                       <span className="text-[#4B5563]">(per year, USD)</span>
//                     </label>
//                     <input
//                       type="number"
//                       value={profile.salaryMin}
//                       onChange={(e) => setProfile({ ...profile, salaryMin: e.target.value })}
//                       placeholder="e.g. 60000"
//                       className="w-full bg-white/5 border border-white/10 text-white text-xs rounded-lg py-2.5 px-3 focus:outline-none focus:border-[#00D4AA] transition"
//                     />
//                   </div>
//                   <div>
//                     <label className="text-[#94A3B8] text-xs mb-1 block">
//                       Max Salary{" "}
//                       <span className="text-[#4B5563]">(per year, USD)</span>
//                     </label>
//                     <input
//                       type="number"
//                       value={profile.salaryMax}
//                       onChange={(e) => setProfile({ ...profile, salaryMax: e.target.value })}
//                       placeholder="e.g. 120000"
//                       className="w-full bg-white/5 border border-white/10 text-white text-xs rounded-lg py-2.5 px-3 focus:outline-none focus:border-[#00D4AA] transition"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="text-[#94A3B8] text-xs mb-2 block">Work Type</label>
//                   <div className="flex gap-2">
//                     {["Remote", "Hybrid", "On-site"].map((type) => (
//                       <button
//                         key={type}
//                         onClick={() =>
//                           setProfile({
//                             ...profile,
//                             workType: profile.workType === type ? "" : type,
//                           })
//                         }
//                         className={`flex-1 py-2 rounded-lg text-xs font-medium border transition ${
//                           profile.workType === type
//                             ? "bg-[#00D4AA]/20 border-[#00D4AA]/50 text-[#00D4AA]"
//                             : "bg-white/5 border-white/10 text-[#94A3B8] hover:text-white"
//                         }`}
//                       >
//                         {type === "Remote" ? "🌐" : type === "Hybrid" ? "🏙" : "🏢"} {type}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               <SaveFooter />
//             </div>

//             {/* Right — preference summary card */}
//             <div className="space-y-4">
//               <div className="bg-[#111827] border border-white/10 rounded-xl p-5">
//                 <p className="text-[#00D4AA] text-[10px] font-bold tracking-widest mb-3">
//                   ● YOUR SEARCH PROFILE
//                 </p>
//                 <div className="space-y-3">
//                   <div>
//                     <p className="text-[#4B5563] text-[10px] mb-1">LOOKING FOR</p>
//                     {profile.desiredTitles.length > 0 ? (
//                       <div className="space-y-1">
//                         {profile.desiredTitles.slice(0, 3).map((t) => (
//                           <p key={t} className="text-white text-xs">• {t}</p>
//                         ))}
//                         {profile.desiredTitles.length > 3 && (
//                           <p className="text-[#4B5563] text-[10px]">
//                             +{profile.desiredTitles.length - 3} more
//                           </p>
//                         )}
//                       </div>
//                     ) : (
//                       <p className="text-[#4B5563] text-xs">Not set</p>
//                     )}
//                   </div>
//                   <div className="border-t border-white/5 pt-3">
//                     <p className="text-[#4B5563] text-[10px] mb-1">LOCATIONS</p>
//                     <p className="text-white text-xs">
//                       {profile.preferredLocations.length > 0
//                         ? profile.preferredLocations.join(", ")
//                         : "Not set"}
//                     </p>
//                   </div>
//                   <div className="border-t border-white/5 pt-3">
//                     <p className="text-[#4B5563] text-[10px] mb-1">WORK TYPE</p>
//                     <p className="text-white text-xs">{profile.workType || "Not set"}</p>
//                   </div>
//                   <div className="border-t border-white/5 pt-3">
//                     <p className="text-[#4B5563] text-[10px] mb-1">SALARY RANGE</p>
//                     <p className="text-white text-xs">
//                       {profile.salaryMin && profile.salaryMax
//                         ? `$${Number(profile.salaryMin).toLocaleString()} – $${Number(profile.salaryMax).toLocaleString()}`
//                         : profile.salaryMin
//                         ? `From $${Number(profile.salaryMin).toLocaleString()}`
//                         : "Not set"}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-[#FFB800]/10 border border-[#FFB800]/20 rounded-xl p-4">
//                 <p className="text-[#FFB800] text-xs font-semibold mb-1">⚡ Daily Job Digest</p>
//                 <p className="text-[#94A3B8] text-[10px]">
//                   Your desired titles and locations power the AI agent that sends you personalized
//                   job matches every morning.
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ── RESUME TAB ── */}
//         {activeTab === "Resume" && (
//           <div className="max-w-2xl space-y-4">
//             {/* Current Resume */}
//             <div className="bg-[#111827] border border-white/10 rounded-xl p-5">
//               <p className="text-[#94A3B8] text-xs font-medium mb-4">📄 Current Resume</p>
//               {profile.resumeUrl ? (
//                 <div className="flex items-center gap-4 p-4 bg-[#0D1321] rounded-xl">
//                   <div className="w-10 h-10 rounded-xl bg-[#00D4AA]/20 flex items-center justify-center text-lg flex-shrink-0">
//                     📄
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <p className="text-white text-xs font-semibold truncate">
//                       {profile.resumeOriginalName || "Resume.pdf"}
//                     </p>
//                     <p className="text-[#94A3B8] text-[10px] mt-0.5">
//                       Uploaded {formatDate(profile.resumeUploadedAt)}
//                     </p>
//                     {profile.atsScore > 0 && (
//                       <p className="text-[10px] mt-0.5" style={{ color: getScoreColor(profile.atsScore) }}>
//                         ATS Score: {profile.atsScore}/100
//                       </p>
//                     )}
//                   </div>
//                   <a
//                     href={profile.resumeUrl}
//                     target="_blank"
//                     rel="noreferrer"
//                     className="bg-[#00D4AA]/10 border border-[#00D4AA]/30 text-[#00D4AA] text-xs px-3 py-1.5 rounded-lg hover:bg-[#00D4AA]/20 transition flex-shrink-0"
//                   >
//                     View PDF
//                   </a>
//                 </div>
//               ) : (
//                 <div className="text-center py-8 border border-dashed border-white/10 rounded-xl">
//                   <p className="text-[#94A3B8] text-sm mb-1">No resume uploaded yet</p>
//                   <p className="text-[#4B5563] text-xs">Go to the Resume page to upload and analyze your resume.</p>
//                 </div>
//               )}
//             </div>

//             {/* ATS breakdown if available */}
//             {profile.atsScore > 0 && (
//               <div className="bg-[#111827] border border-white/10 rounded-xl p-5">
//                 <p className="text-[#94A3B8] text-xs font-medium mb-4">🎯 ATS Analysis Summary</p>
//                 <div className="grid grid-cols-2 gap-3 mb-4">
//                   {[
//                     { label: "Overall Score", value: profile.atsScore },
//                   ].map(({ label, value }) => (
//                     <div key={label} className="col-span-2 bg-[#0D1321] rounded-xl p-3 flex items-center justify-between">
//                       <p className="text-[#94A3B8] text-xs">{label}</p>
//                       <p className="font-bold text-lg" style={{ color: getScoreColor(value) }}>
//                         {value}<span className="text-xs text-[#94A3B8]">/100</span>
//                       </p>
//                     </div>
//                   ))}
//                 </div>
//                 {profile.atsTopSkillsFound.length > 0 && (
//                   <div>
//                     <p className="text-[#4B5563] text-[10px] mb-2">TOP SKILLS DETECTED</p>
//                     <div className="flex flex-wrap gap-2">
//                       {profile.atsTopSkillsFound.map((skill) => (
//                         <span
//                           key={skill}
//                           className="bg-[#00D4AA]/10 border border-[#00D4AA]/20 text-[#00D4AA] text-xs px-3 py-1 rounded-full"
//                         >
//                           {skill}
//                         </span>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//                 <div className="mt-4 pt-4 border-t border-white/5">
//                   <a
//                     href="/resume"
//                     className="text-[#00D4AA] text-xs hover:underline"
//                   >
//                     Go to Resume page to re-analyze →
//                   </a>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}

//         {/* ── ACCOUNT TAB ── */}
//         {activeTab === "Account" && (
//           <div className="max-w-2xl space-y-4">
//             {/* Account Info */}
//             <div className="bg-[#111827] border border-white/10 rounded-xl p-5">
//               <p className="text-[#94A3B8] text-xs font-medium mb-4">🔐 Account Information</p>
//               <div className="space-y-3">
//                 <div className="flex items-center justify-between py-2 border-b border-white/5">
//                   <div>
//                     <p className="text-[#94A3B8] text-[10px]">FULL NAME</p>
//                     <p className="text-white text-xs mt-0.5">{user?.fullName || "—"}</p>
//                   </div>
//                   <button
//                     onClick={() => setActiveTab("Profile")}
//                     className="text-[#00D4AA] text-xs hover:underline"
//                   >
//                     Edit
//                   </button>
//                 </div>
//                 <div className="flex items-center justify-between py-2 border-b border-white/5">
//                   <div>
//                     <p className="text-[#94A3B8] text-[10px]">EMAIL</p>
//                     <p className="text-white text-xs mt-0.5">{user?.email || "—"}</p>
//                   </div>
//                   <span className="bg-[#00D4AA]/10 text-[#00D4AA] text-[10px] px-2 py-0.5 rounded-full">
//                     Verified
//                   </span>
//                 </div>
//                 <div className="flex items-center justify-between py-2">
//                   <div>
//                     <p className="text-[#94A3B8] text-[10px]">MEMBER SINCE</p>
//                     <p className="text-white text-xs mt-0.5">{formatDate(user?.createdAt)}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Danger Zone */}
//             <div className="bg-[#111827] border border-[#FF4D6D]/20 rounded-xl p-5">
//               <p className="text-[#FF4D6D] text-xs font-medium mb-3">⚠ Danger Zone</p>
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-white text-xs">Delete Account</p>
//                   <p className="text-[#94A3B8] text-[10px]">
//                     Permanently delete your account and all data. This cannot be undone.
//                   </p>
//                 </div>
//                 <button
//                   onClick={() => alert("Contact support to delete your account.")}
//                   className="bg-[#FF4D6D]/10 border border-[#FF4D6D]/30 text-[#FF4D6D] text-xs px-4 py-2 rounded-lg hover:bg-[#FF4D6D]/20 transition flex-shrink-0 ml-4"
//                 >
//                   Delete Account
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </DashboardLayout>
//   )
// }






// client/src/pages/Profile.jsx
import { useState, useEffect } from "react"
import api from '../services/api'
import DashboardLayout from "../components/layout/DashboardLayout"
import { useAuth } from "../context/AuthContext"

const tabs = ["Profile", "Preferences", "Resume", "Account"]

export default function Profile() {
  const [activeTab, setActiveTab] = useState("Profile")
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const [newSkill, setNewSkill] = useState("")
  const [newLocation, setNewLocation] = useState("")
  const [newTitle, setNewTitle] = useState("")
  const [avatarLoading, setAvatarLoading] = useState(false)

  const [profile, setProfile] = useState({
    professionalTitle: "",
    location: "",
    bio: "",
    skills: [],
    desiredTitles: [],
    preferredLocation: "",
    preferredLocations: [],
    salaryMin: "",
    salaryMax: "",
    workType: "",
    avatarUrl: "",
    resumeUrl: "",
    resumeOriginalName: "",
    resumeUploadedAt: null,
    atsScore: 0,
    atsTopSkillsFound: [],
  })

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")

  useEffect(() => {
    if (user?.fullName) {
      const parts = user.fullName.split(" ")
      setFirstName(parts[0] || "")
      setLastName(parts.slice(1).join(" ") || "")
    }
  }, [user])

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/api/profile")
        const p = res.data.profile
        setProfile({
          professionalTitle: p.professionalTitle || "",
          location: p.location || "",
          bio: p.bio || "",
          skills: [...new Set([...(p.skills || []), ...(p.atsTopSkillsFound || [])])],
          desiredTitles: p.desiredTitles || [],
          preferredLocation: p.preferredLocation || "",
          preferredLocations: p.preferredLocations || [],
          salaryMin: p.salaryMin || "",
          salaryMax: p.salaryMax || "",
          workType: p.workType || "",
          avatarUrl: p.avatarUrl || "",
          resumeUrl: p.resumeUrl || "",
          resumeOriginalName: p.resumeOriginalName || "",
          resumeUploadedAt: p.resumeUploadedAt || null,
          atsScore: p.atsScore || 0,
          atsTopSkillsFound: p.atsTopSkillsFound || [],
        })
      } catch (err) {
        console.error("Failed to fetch profile", err)
      } finally {
        setFetchLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleSave = async () => {
    setError("")
    setSuccess("")
    try {
      setLoading(true)
      const fullName = `${firstName} ${lastName}`.trim()
      await api.put("/api/profile/save", { ...profile, fullName })
      setSuccess("Profile saved successfully!")
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save")
    } finally {
      setLoading(false)
    }
  }

  const handleAddSkill = () => {
    const trimmed = newSkill.trim()
    if (trimmed && !profile.skills.includes(trimmed)) {
      setProfile({ ...profile, skills: [...profile.skills, trimmed] })
      setNewSkill("")
    }
  }
  const handleRemoveSkill = (skill) =>
    setProfile({ ...profile, skills: profile.skills.filter((s) => s !== skill) })

  const handleAddLocation = () => {
    const trimmed = newLocation.trim()
    if (trimmed && !profile.preferredLocations.includes(trimmed)) {
      setProfile({ ...profile, preferredLocations: [...profile.preferredLocations, trimmed] })
      setNewLocation("")
    }
  }
  const handleRemoveLocation = (loc) =>
    setProfile({ ...profile, preferredLocations: profile.preferredLocations.filter((l) => l !== loc) })

  const handleAddTitle = () => {
    const trimmed = newTitle.trim()
    if (trimmed && !profile.desiredTitles.includes(trimmed)) {
      setProfile({ ...profile, desiredTitles: [...profile.desiredTitles, trimmed] })
      setNewTitle("")
    }
  }
  const handleRemoveTitle = (title) =>
    setProfile({ ...profile, desiredTitles: profile.desiredTitles.filter((t) => t !== title) })

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    try {
      setAvatarLoading(true)
      const formData = new FormData()
      formData.append("avatar", file)
      const res = await api.post("/api/profile/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      setProfile({ ...profile, avatarUrl: res.data.avatarUrl })
    } catch (err) {
      setError("Failed to upload image")
    } finally {
      setAvatarLoading(false)
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return "—"
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    })
  }

  const getScoreColor = (score) => {
    if (score >= 80) return "#00D4AA"
    if (score >= 60) return "#FFB800"
    return "#FF4D6D"
  }

  const SaveFooter = () => (
    <div className="space-y-3">
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
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
        <button
          onClick={() => window.location.reload()}
          className="w-full sm:w-auto text-[#94A3B8] text-xs px-4 py-2.5 rounded-lg border border-white/10 hover:text-white transition"
        >
          Discard Changes
        </button>
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full sm:w-auto bg-gradient-to-r from-[#00D4AA] to-[#0099FF] text-white text-xs font-semibold px-6 py-2.5 rounded-lg hover:opacity-90 transition disabled:opacity-60"
        >
          {loading ? "Saving..." : "💾 Save Changes"}
        </button>
      </div>
    </div>
  )

  if (fetchLoading)
    return (
      <DashboardLayout title="Profile & Settings">
        <div className="flex items-center justify-center h-64">
          <div className="text-[#00D4AA]">Loading profile...</div>
        </div>
      </DashboardLayout>
    )

  return (
    <DashboardLayout title="Profile & Settings">
      <div>
        <h2 className="text-white text-xl sm:text-2xl font-bold mb-1">Account Settings</h2>
        <p className="text-[#94A3B8] text-xs sm:text-sm mb-4 sm:mb-6">
          Manage your professional profile and application preferences.
        </p>

        {/* Tabs — scrollable on mobile */}
        <div className="flex gap-0 border-b border-white/10 mb-4 sm:mb-6 overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-shrink-0 px-3 sm:px-4 py-2 text-xs sm:text-sm transition border-b-2 -mb-px whitespace-nowrap ${
                activeTab === tab
                  ? "border-[#00D4AA] text-[#00D4AA]"
                  : "border-transparent text-[#94A3B8] hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── PROFILE TAB ── */}
        {activeTab === "Profile" && (
          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Avatar Card */}
            <div className="bg-[#111827] border border-white/10 rounded-xl p-4 sm:p-6 flex flex-col items-center text-center lg:h-fit">
              <div className="relative mb-4">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt="Avatar"
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-[#00D4AA]/30"
                  />
                ) : (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#00D4AA]/20 flex items-center justify-center text-3xl sm:text-4xl border-2 border-[#00D4AA]/30">
                    {user?.fullName?.charAt(0) || "👤"}
                  </div>
                )}
                <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#00D4AA] flex items-center justify-center text-[10px]">
                  ✓
                </div>
              </div>
              <p className="text-white font-bold text-base sm:text-lg">{user?.fullName}</p>
              <p className="text-[#94A3B8] text-xs mb-1">
                {profile.professionalTitle || "Add your title"}
              </p>
              <p className="text-[#94A3B8] text-[10px] mb-1">{profile.location || ""}</p>
              <p className="text-[#4B5563] text-[10px] mb-3">JPG, GIF or PNG. Max 800KB</p>
              <input
                id="avatarInput"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />
              <button
                onClick={() => document.getElementById("avatarInput").click()}
                disabled={avatarLoading}
                className="w-full max-w-[200px] lg:max-w-full bg-white/5 border border-white/10 text-white text-xs py-2 rounded-lg hover:bg-white/10 transition disabled:opacity-60"
              >
                {avatarLoading ? "Uploading..." : "Upload New Image"}
              </button>

              {profile.atsScore > 0 && (
                <div className="mt-4 w-full max-w-[200px] lg:max-w-full bg-[#0D1321] rounded-xl p-3 text-left">
                  <p className="text-[#94A3B8] text-[10px] mb-1">ATS SCORE</p>
                  <p className="font-bold text-xl" style={{ color: getScoreColor(profile.atsScore) }}>
                    {profile.atsScore}
                    <span className="text-xs text-[#94A3B8]">/100</span>
                  </p>
                  <div className="w-full h-1.5 bg-white/10 rounded-full mt-2">
                    <div
                      className="h-1.5 rounded-full"
                      style={{
                        width: `${profile.atsScore}%`,
                        backgroundColor: getScoreColor(profile.atsScore),
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Right — Personal Info + Skills */}
            <div className="lg:col-span-2 space-y-4">
              {/* Personal Info */}
              <div className="bg-[#111827] border border-white/10 rounded-xl p-4 sm:p-5">
                <p className="text-[#94A3B8] text-xs font-medium mb-4">🗂 Personal Information</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                  <div>
                    <label className="text-[#94A3B8] text-xs mb-1 block">First Name</label>
                    <input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 text-white text-xs rounded-lg py-2.5 px-3 focus:outline-none focus:border-[#00D4AA] transition"
                    />
                  </div>
                  <div>
                    <label className="text-[#94A3B8] text-xs mb-1 block">Last Name</label>
                    <input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 text-white text-xs rounded-lg py-2.5 px-3 focus:outline-none focus:border-[#00D4AA] transition"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="text-[#94A3B8] text-xs mb-1 block">Email Address</label>
                  <input
                    value={user?.email || ""}
                    disabled
                    className="w-full bg-white/5 border border-white/10 text-[#94A3B8] text-xs rounded-lg py-2.5 px-3 opacity-60 cursor-not-allowed"
                  />
                </div>

                <div className="mb-4">
                  <label className="text-[#94A3B8] text-xs mb-1 block">Professional Title</label>
                  <input
                    value={profile.professionalTitle}
                    onChange={(e) => setProfile({ ...profile, professionalTitle: e.target.value })}
                    placeholder="e.g. Senior Software Engineer"
                    className="w-full bg-white/5 border border-white/10 text-white text-xs rounded-lg py-2.5 px-3 focus:outline-none focus:border-[#00D4AA] transition"
                  />
                </div>

                <div className="mb-4">
                  <label className="text-[#94A3B8] text-xs mb-1 block">
                    Current Location{" "}
                    <span className="text-[#4B5563]">(where you live)</span>
                  </label>
                  <input
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    placeholder="e.g. Hyderabad, India"
                    className="w-full bg-white/5 border border-white/10 text-white text-xs rounded-lg py-2.5 px-3 focus:outline-none focus:border-[#00D4AA] transition"
                  />
                </div>

                <div>
                  <label className="text-[#94A3B8] text-xs mb-1 block">Professional Bio</label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    rows={3}
                    placeholder="Briefly describe your career journey..."
                    className="w-full bg-white/5 border border-white/10 text-white text-xs rounded-lg py-2.5 px-3 focus:outline-none focus:border-[#00D4AA] transition resize-none"
                  />
                </div>
              </div>

              {/* Skills */}
              <div className="bg-[#111827] border border-white/10 rounded-xl p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[#94A3B8] text-xs font-medium">⚡ Core Skills</p>
                  {profile.atsTopSkillsFound.length > 0 && (
                    <p className="text-[#4B5563] text-[10px]">
                      {profile.atsTopSkillsFound.length} from resume
                    </p>
                  )}
                </div>
                <div className="flex gap-2 mb-3">
                  <input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
                    placeholder="Type a skill and press Enter"
                    className="flex-1 min-w-0 bg-white/5 border border-white/10 text-white text-xs rounded-lg py-2 px-3 focus:outline-none focus:border-[#00D4AA] transition"
                  />
                  <button
                    onClick={handleAddSkill}
                    className="flex-shrink-0 bg-[#00D4AA]/10 border border-[#00D4AA]/30 text-[#00D4AA] text-xs px-3 py-2 rounded-lg hover:bg-[#00D4AA]/20 transition"
                  >
                    + Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-[#00D4AA]/10 border border-[#00D4AA]/20 text-[#00D4AA] text-xs px-3 py-1 rounded-full flex items-center gap-1"
                    >
                      {skill}
                      <button
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-[#00D4AA]/60 hover:text-[#FF4D6D] ml-1 leading-none"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {profile.skills.length === 0 && (
                    <p className="text-[#4B5563] text-xs">
                      No skills added yet. Type above or analyze your resume.
                    </p>
                  )}
                </div>
              </div>

              <SaveFooter />
            </div>
          </div>
        )}

        {/* ── PREFERENCES TAB ── */}
        {activeTab === "Preferences" && (
          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="lg:col-span-2 space-y-4">
              {/* Desired Job Titles */}
              <div className="bg-[#111827] border border-white/10 rounded-xl p-4 sm:p-5">
                <p className="text-[#94A3B8] text-xs font-medium mb-1">🎯 Desired Job Titles</p>
                <p className="text-[#4B5563] text-[10px] mb-3">
                  Used by the Daily Job Digest to find matching opportunities.
                </p>
                <div className="flex gap-2 mb-3">
                  <input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddTitle()}
                    placeholder="e.g. Full Stack Developer..."
                    className="flex-1 min-w-0 bg-white/5 border border-white/10 text-white text-xs rounded-lg py-2 px-3 focus:outline-none focus:border-[#00D4AA] transition"
                  />
                  <button
                    onClick={handleAddTitle}
                    className="flex-shrink-0 bg-[#00D4AA]/10 border border-[#00D4AA]/30 text-[#00D4AA] text-xs px-3 py-2 rounded-lg hover:bg-[#00D4AA]/20 transition"
                  >
                    + Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.desiredTitles.map((title) => (
                    <span
                      key={title}
                      className="bg-[#0099FF]/10 border border-[#0099FF]/20 text-[#0099FF] text-xs px-3 py-1 rounded-full flex items-center gap-1"
                    >
                      🎯 {title}
                      <button
                        onClick={() => handleRemoveTitle(title)}
                        className="text-[#0099FF]/60 hover:text-[#FF4D6D] ml-1 leading-none"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {profile.desiredTitles.length === 0 && (
                    <p className="text-[#4B5563] text-xs">
                      Add at least one job title to power your daily digest.
                    </p>
                  )}
                </div>
              </div>

              {/* Preferred Locations */}
              <div className="bg-[#111827] border border-white/10 rounded-xl p-4 sm:p-5">
                <p className="text-[#94A3B8] text-xs font-medium mb-1">📍 Preferred Job Locations</p>
                <p className="text-[#4B5563] text-[10px] mb-3">
                  Where you want to work — different from where you currently live.
                </p>
                <div className="flex gap-2 mb-3">
                  <input
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddLocation()}
                    placeholder="e.g. Remote, Bangalore..."
                    className="flex-1 min-w-0 bg-white/5 border border-white/10 text-white text-xs rounded-lg py-2 px-3 focus:outline-none focus:border-[#00D4AA] transition"
                  />
                  <button
                    onClick={handleAddLocation}
                    className="flex-shrink-0 bg-[#00D4AA]/10 border border-[#00D4AA]/30 text-[#00D4AA] text-xs px-3 py-2 rounded-lg hover:bg-[#00D4AA]/20 transition"
                  >
                    + Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.preferredLocations.map((loc) => (
                    <span
                      key={loc}
                      className="bg-[#00D4AA]/10 border border-[#00D4AA]/20 text-[#00D4AA] text-xs px-3 py-1 rounded-full flex items-center gap-1"
                    >
                      📍 {loc}
                      <button
                        onClick={() => handleRemoveLocation(loc)}
                        className="text-[#00D4AA]/60 hover:text-[#FF4D6D] ml-1 leading-none"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {profile.preferredLocations.length === 0 && (
                    <p className="text-[#4B5563] text-xs">Add your preferred work locations.</p>
                  )}
                </div>
              </div>

              {/* Salary + Work Type */}
              <div className="bg-[#111827] border border-white/10 rounded-xl p-4 sm:p-5">
                <p className="text-[#94A3B8] text-xs font-medium mb-4">💰 Salary & Work Preference</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                  <div>
                    <label className="text-[#94A3B8] text-xs mb-1 block">
                      Min Salary{" "}
                      <span className="text-[#4B5563]">(per year, USD)</span>
                    </label>
                    <input
                      type="number"
                      value={profile.salaryMin}
                      onChange={(e) => setProfile({ ...profile, salaryMin: e.target.value })}
                      placeholder="e.g. 60000"
                      className="w-full bg-white/5 border border-white/10 text-white text-xs rounded-lg py-2.5 px-3 focus:outline-none focus:border-[#00D4AA] transition"
                    />
                  </div>
                  <div>
                    <label className="text-[#94A3B8] text-xs mb-1 block">
                      Max Salary{" "}
                      <span className="text-[#4B5563]">(per year, USD)</span>
                    </label>
                    <input
                      type="number"
                      value={profile.salaryMax}
                      onChange={(e) => setProfile({ ...profile, salaryMax: e.target.value })}
                      placeholder="e.g. 120000"
                      className="w-full bg-white/5 border border-white/10 text-white text-xs rounded-lg py-2.5 px-3 focus:outline-none focus:border-[#00D4AA] transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[#94A3B8] text-xs mb-2 block">Work Type</label>
                  <div className="flex gap-2">
                    {["Remote", "Hybrid", "On-site"].map((type) => (
                      <button
                        key={type}
                        onClick={() =>
                          setProfile({
                            ...profile,
                            workType: profile.workType === type ? "" : type,
                          })
                        }
                        className={`flex-1 py-2 rounded-lg text-[10px] sm:text-xs font-medium border transition ${
                          profile.workType === type
                            ? "bg-[#00D4AA]/20 border-[#00D4AA]/50 text-[#00D4AA]"
                            : "bg-white/5 border-white/10 text-[#94A3B8] hover:text-white"
                        }`}
                      >
                        {type === "Remote" ? "🌐" : type === "Hybrid" ? "🏙" : "🏢"}{" "}
                        <span className="hidden xs:inline">{type}</span>
                        <span className="xs:hidden">{type.slice(0, type === "On-site" ? 6 : 99)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <SaveFooter />
            </div>

            {/* Right — preference summary card */}
            <div className="space-y-4">
              <div className="bg-[#111827] border border-white/10 rounded-xl p-4 sm:p-5">
                <p className="text-[#00D4AA] text-[10px] font-bold tracking-widest mb-3">
                  ● YOUR SEARCH PROFILE
                </p>
                <div className="space-y-3">
                  <div>
                    <p className="text-[#4B5563] text-[10px] mb-1">LOOKING FOR</p>
                    {profile.desiredTitles.length > 0 ? (
                      <div className="space-y-1">
                        {profile.desiredTitles.slice(0, 3).map((t) => (
                          <p key={t} className="text-white text-xs">• {t}</p>
                        ))}
                        {profile.desiredTitles.length > 3 && (
                          <p className="text-[#4B5563] text-[10px]">
                            +{profile.desiredTitles.length - 3} more
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-[#4B5563] text-xs">Not set</p>
                    )}
                  </div>
                  <div className="border-t border-white/5 pt-3">
                    <p className="text-[#4B5563] text-[10px] mb-1">LOCATIONS</p>
                    <p className="text-white text-xs break-words">
                      {profile.preferredLocations.length > 0
                        ? profile.preferredLocations.join(", ")
                        : "Not set"}
                    </p>
                  </div>
                  <div className="border-t border-white/5 pt-3">
                    <p className="text-[#4B5563] text-[10px] mb-1">WORK TYPE</p>
                    <p className="text-white text-xs">{profile.workType || "Not set"}</p>
                  </div>
                  <div className="border-t border-white/5 pt-3">
                    <p className="text-[#4B5563] text-[10px] mb-1">SALARY RANGE</p>
                    <p className="text-white text-xs">
                      {profile.salaryMin && profile.salaryMax
                        ? `$${Number(profile.salaryMin).toLocaleString()} – $${Number(profile.salaryMax).toLocaleString()}`
                        : profile.salaryMin
                        ? `From $${Number(profile.salaryMin).toLocaleString()}`
                        : "Not set"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[#FFB800]/10 border border-[#FFB800]/20 rounded-xl p-4">
                <p className="text-[#FFB800] text-xs font-semibold mb-1">⚡ Daily Job Digest</p>
                <p className="text-[#94A3B8] text-[10px]">
                  Your desired titles and locations power the AI agent that sends you personalized
                  job matches every morning.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── RESUME TAB ── */}
        {activeTab === "Resume" && (
          <div className="w-full max-w-2xl space-y-4">
            {/* Current Resume */}
            <div className="bg-[#111827] border border-white/10 rounded-xl p-4 sm:p-5">
              <p className="text-[#94A3B8] text-xs font-medium mb-4">📄 Current Resume</p>
              {profile.resumeUrl ? (
                <div className="flex items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-[#0D1321] rounded-xl">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#00D4AA]/20 flex items-center justify-center text-base sm:text-lg flex-shrink-0">
                    📄
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-semibold truncate">
                      {profile.resumeOriginalName || "Resume.pdf"}
                    </p>
                    <p className="text-[#94A3B8] text-[10px] mt-0.5">
                      Uploaded {formatDate(profile.resumeUploadedAt)}
                    </p>
                    {profile.atsScore > 0 && (
                      <p className="text-[10px] mt-0.5" style={{ color: getScoreColor(profile.atsScore) }}>
                        ATS Score: {profile.atsScore}/100
                      </p>
                    )}
                  </div>
                  <a
                    href={profile.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-shrink-0 bg-[#00D4AA]/10 border border-[#00D4AA]/30 text-[#00D4AA] text-xs px-3 py-1.5 rounded-lg hover:bg-[#00D4AA]/20 transition"
                  >
                    View PDF
                  </a>
                </div>
              ) : (
                <div className="text-center py-8 border border-dashed border-white/10 rounded-xl">
                  <p className="text-[#94A3B8] text-sm mb-1">No resume uploaded yet</p>
                  <p className="text-[#4B5563] text-xs px-4">Go to the Resume page to upload and analyze your resume.</p>
                </div>
              )}
            </div>

            {profile.atsScore > 0 && (
              <div className="bg-[#111827] border border-white/10 rounded-xl p-4 sm:p-5">
                <p className="text-[#94A3B8] text-xs font-medium mb-4">🎯 ATS Analysis Summary</p>
                <div className="grid grid-cols-1 gap-3 mb-4">
                  <div className="bg-[#0D1321] rounded-xl p-3 flex items-center justify-between">
                    <p className="text-[#94A3B8] text-xs">Overall Score</p>
                    <p className="font-bold text-lg" style={{ color: getScoreColor(profile.atsScore) }}>
                      {profile.atsScore}<span className="text-xs text-[#94A3B8]">/100</span>
                    </p>
                  </div>
                </div>
                {profile.atsTopSkillsFound.length > 0 && (
                  <div>
                    <p className="text-[#4B5563] text-[10px] mb-2">TOP SKILLS DETECTED</p>
                    <div className="flex flex-wrap gap-2">
                      {profile.atsTopSkillsFound.map((skill) => (
                        <span
                          key={skill}
                          className="bg-[#00D4AA]/10 border border-[#00D4AA]/20 text-[#00D4AA] text-xs px-3 py-1 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="mt-4 pt-4 border-t border-white/5">
                  <a href="/resume" className="text-[#00D4AA] text-xs hover:underline">
                    Go to Resume page to re-analyze →
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── ACCOUNT TAB ── */}
        {activeTab === "Account" && (
          <div className="w-full max-w-2xl space-y-4">
            <div className="bg-[#111827] border border-white/10 rounded-xl p-4 sm:p-5">
              <p className="text-[#94A3B8] text-xs font-medium mb-4">🔐 Account Information</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-white/5 gap-3">
                  <div className="min-w-0">
                    <p className="text-[#94A3B8] text-[10px]">FULL NAME</p>
                    <p className="text-white text-xs mt-0.5 truncate">{user?.fullName || "—"}</p>
                  </div>
                  <button
                    onClick={() => setActiveTab("Profile")}
                    className="flex-shrink-0 text-[#00D4AA] text-xs hover:underline"
                  >
                    Edit
                  </button>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/5 gap-3">
                  <div className="min-w-0">
                    <p className="text-[#94A3B8] text-[10px]">EMAIL</p>
                    <p className="text-white text-xs mt-0.5 truncate">{user?.email || "—"}</p>
                  </div>
                  <span className="flex-shrink-0 bg-[#00D4AA]/10 text-[#00D4AA] text-[10px] px-2 py-0.5 rounded-full">
                    Verified
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-[#94A3B8] text-[10px]">MEMBER SINCE</p>
                    <p className="text-white text-xs mt-0.5">{formatDate(user?.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-[#111827] border border-[#FF4D6D]/20 rounded-xl p-4 sm:p-5">
              <p className="text-[#FF4D6D] text-xs font-medium mb-3">⚠ Danger Zone</p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <div className="flex-1">
                  <p className="text-white text-xs">Delete Account</p>
                  <p className="text-[#94A3B8] text-[10px] mt-0.5">
                    Permanently delete your account and all data. This cannot be undone.
                  </p>
                </div>
                <button
                  onClick={() => alert("Contact support to delete your account.")}
                  className="w-full sm:w-auto flex-shrink-0 bg-[#FF4D6D]/10 border border-[#FF4D6D]/30 text-[#FF4D6D] text-xs px-4 py-2 rounded-lg hover:bg-[#FF4D6D]/20 transition"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}