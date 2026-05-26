// // client/src/pages/Login.jsx
// import { useState } from "react"
// import { Link, useNavigate } from "react-router-dom"
// import api from '../services/api' 
// import { useAuth } from "../context/AuthContext"

// export default function Login() {
//   const [showPassword, setShowPassword] = useState(false)
//   const [formData, setFormData] = useState({ email: "", password: "" })
//   const [error, setError] = useState("")
//   const [loading, setLoading] = useState(false)
//   const { login } = useAuth()
//   const navigate = useNavigate()

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setError("")
//     try {
//       setLoading(true)
//       const res = await api.post("/api/auth/login", formData )
//       login(res.data.user)
//       navigate("/dashboard")
//     } catch (err) {
//       setError(err.response?.data?.message || "Something went wrong")
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-[#0A0F1E] flex items-center justify-center p-4">
//       <div className="w-full max-w-4xl bg-[#111827] rounded-2xl overflow-hidden flex shadow-2xl border border-white/10">

//         {/* Left Side */}
//         <div className="hidden md:flex w-1/2 bg-[#0D1321] flex-col justify-between p-10 relative overflow-hidden">
//           <div className="absolute inset-0 bg-gradient-to-br from-[#00D4AA]/10 to-transparent" />
//           <div className="relative z-10">
//             <div className="flex items-center gap-2 mb-8">
//               <span className="text-2xl">🚀</span>
//               <span className="text-white font-bold text-xl">SmartHire</span>
//             </div>
//             <h2 className="text-white text-2xl font-semibold leading-snug">
//               The future of professional recruitment, powered by next-generation neural matching.
//             </h2>
//           </div>
//           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#00D4AA]/10 rounded-full blur-3xl" />
//           <div className="relative z-10 bg-white/5 border border-white/10 rounded-xl p-4">
//             <p className="text-[#94A3B8] text-sm italic">
//               "SmartHire transformed our engineering team's efficiency within weeks. The AI-driven candidate ranking is surgical."
//             </p>
//             <div className="flex items-center gap-3 mt-3">
//               <div className="w-8 h-8 rounded-full bg-[#00D4AA]/20 flex items-center justify-center text-[#00D4AA] text-xs font-bold">MC</div>
//               <div>
//                 <p className="text-white text-xs font-semibold">Marcus Chen</p>
//                 <p className="text-[#94A3B8] text-xs">CTO AT TECHFLOW</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Right Side */}
//         <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
//           <h1 className="text-white text-3xl font-bold mb-1">Welcome back</h1>
//           <p className="text-[#94A3B8] text-sm mb-8">Please enter your details to sign in.</p>

//           <button className="w-full flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-white py-3 rounded-lg hover:bg-white/10 transition mb-4">
//             <svg className="w-5 h-5" viewBox="0 0 24 24">
//               <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
//               <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
//               <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
//               <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
//             </svg>
//             Continue with Google
//           </button>

//           <div className="flex items-center gap-3 my-4">
//             <div className="flex-1 h-px bg-white/10" />
//             <span className="text-[#94A3B8] text-xs">OR</span>
//             <div className="flex-1 h-px bg-white/10" />
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label className="text-[#94A3B8] text-sm mb-1 block">Email</label>
//               <div className="relative">
//                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">@</span>
//                 <input
//                   type="email"
//                   placeholder="name@company.com"
//                   value={formData.email}
//                   onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                   className="w-full bg-white/5 border border-white/10 text-white placeholder-[#4B5563] rounded-lg py-3 pl-9 pr-4 focus:outline-none focus:border-[#00D4AA] transition"
//                 />
//               </div>
//             </div>

//             <div>
//               <div className="flex justify-between mb-1">
//                 <label className="text-[#94A3B8] text-sm">Password</label>
//                 <Link to="/forgot-password" className="text-[#00D4AA] text-sm hover:underline">Forget?</Link>
//               </div>
//               <div className="relative">
//                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">🔒</span>
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   placeholder="••••••••"
//                   value={formData.password}
//                   onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//                   className="w-full bg-white/5 border border-white/10 text-white placeholder-[#4B5563] rounded-lg py-3 pl-9 pr-10 focus:outline-none focus:border-[#00D4AA] transition"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-white"
//                 >
//                   {showPassword ? "👁" : "👁‍🗨"}
//                 </button>
//               </div>
//             </div>

//             {error && (
//               <div className="bg-[#FF4D6D]/10 border border-[#FF4D6D]/30 text-[#FF4D6D] text-sm px-4 py-3 rounded-lg">
//                 {error}
//               </div>
//             )}

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-gradient-to-r from-[#00D4AA] to-[#0099FF] text-white font-semibold py-3 rounded-lg hover:opacity-90 transition disabled:opacity-60 mt-2"
//             >
//               {loading ? "Signing in..." : "Sign In"}
//             </button>
//           </form>

//           <p className="text-[#94A3B8] text-sm text-center mt-6">
//             Don't have an account?{" "}
//             <Link to="/signup" className="text-[#00D4AA] hover:underline font-medium">Sign up</Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   )
// }



// client/src/pages/Login.jsx
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import api from '../services/api' 
import { useAuth } from "../context/AuthContext"

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    try {
      setLoading(true)
      const res = await api.post("/api/auth/login", formData)
      login(res.data.user)
      navigate("/dashboard")
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0F1E] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-[#111827] rounded-2xl overflow-hidden flex shadow-2xl border border-white/10">

        {/* Left Side — hidden on mobile */}
        <div className="hidden md:flex w-1/2 bg-[#0D1321] flex-col justify-between p-10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00D4AA]/10 to-transparent" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-8">
              <span className="text-2xl">🚀</span>
              <span className="text-white font-bold text-xl">SmartHire</span>
            </div>
            <h2 className="text-white text-2xl font-semibold leading-snug">
              The future of professional recruitment, powered by next-generation neural matching.
            </h2>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#00D4AA]/10 rounded-full blur-3xl" />
          <div className="relative z-10 bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-[#94A3B8] text-sm italic">
              "SmartHire transformed our engineering team's efficiency within weeks. The AI-driven candidate ranking is surgical."
            </p>
            <div className="flex items-center gap-3 mt-3">
              <div className="w-8 h-8 rounded-full bg-[#00D4AA]/20 flex items-center justify-center text-[#00D4AA] text-xs font-bold">MC</div>
              <div>
                <p className="text-white text-xs font-semibold">Marcus Chen</p>
                <p className="text-[#94A3B8] text-xs">CTO AT TECHFLOW</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side — full width on mobile */}
        <div className="w-full md:w-1/2 p-6 sm:p-10 flex flex-col justify-center">
          {/* Mobile logo — shown only on mobile */}
          <div className="flex items-center gap-2 mb-6 md:hidden">
            <span className="text-xl">🚀</span>
            <span className="text-white font-bold text-lg">SmartHire</span>
          </div>

          <h1 className="text-white text-2xl sm:text-3xl font-bold mb-1">Welcome back</h1>
          <p className="text-[#94A3B8] text-sm mb-6 sm:mb-8">Please enter your details to sign in.</p>

          <button className="w-full flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-white py-3 rounded-lg hover:bg-white/10 transition mb-4">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[#94A3B8] text-xs">OR</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[#94A3B8] text-sm mb-1 block">Email</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] text-sm">@</span>
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-[#4B5563] rounded-lg py-3 pl-9 pr-4 focus:outline-none focus:border-[#00D4AA] transition text-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-[#94A3B8] text-sm">Password</label>
                <Link to="/forgot-password" className="text-[#00D4AA] text-sm hover:underline">Forget?</Link>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">🔒</span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-[#4B5563] rounded-lg py-3 pl-9 pr-10 focus:outline-none focus:border-[#00D4AA] transition text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-white"
                >
                  {showPassword ? "👁" : "👁‍🗨"}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-[#FF4D6D]/10 border border-[#FF4D6D]/30 text-[#FF4D6D] text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#00D4AA] to-[#0099FF] text-white font-semibold py-3 rounded-lg hover:opacity-90 transition disabled:opacity-60 mt-2"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-[#94A3B8] text-sm text-center mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="text-[#00D4AA] hover:underline font-medium">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}