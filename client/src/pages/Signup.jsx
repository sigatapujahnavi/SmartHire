// client/src/pages/Signup.jsx
import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import api from '../services/api' 
import { useAuth } from "../context/AuthContext"

export default function Signup() {
 const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [otpError, setOtpError] = useState("")
  const [otpLoading, setOtpLoading] = useState(false)
  const [timer, setTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const otpRefs = useRef([])
  const navigate = useNavigate()

  const getPasswordStrength = (password) => {
    if (password.length === 0) return { label: "", color: "", width: "0%" }
    if (password.length < 6) return { label: "Weak", color: "#FF4D6D", width: "33%" }
    if (password.length < 10) return { label: "Medium", color: "#FFB800", width: "66%" }
    return { label: "Strong", color: "#00D4AA", width: "100%" }
  }

  const strength = getPasswordStrength(formData.password)

  // Timer countdown
  useEffect(() => {
    if (!otpSent) return
    setTimer(60)
    setCanResend(false)
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          setCanResend(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [otpSent])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match!")
    }
    if (formData.password.length < 6) {
      return setError("Password must be at least 6 characters!")
    }

    try {
      setLoading(true)
      await api.post("/api/auth/signup", {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      })
      setOtpSent(true)
      // focus first OTP box after render
      setTimeout(() => otpRefs.current[0]?.focus(), 100)
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (!canResend) return
    setOtpError("")
    try {
      await api.post("/api/auth/signup", {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      })
      setOtp(["", "", "", "", "", ""])
      setOtpSent(true) // triggers timer useEffect again
      setTimeout(() => otpRefs.current[0]?.focus(), 100)
    } catch (err) {
      setOtpError(err.response?.data?.message || "Failed to resend OTP")
    }
  }

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return // numbers only
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1) // only last character
    setOtp(newOtp)
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    if (pasted.length === 6) {
      setOtp(pasted.split(""))
      otpRefs.current[5]?.focus()
    }
  }

  const handleVerifyOTP = async () => {
    const otpValue = otp.join("")
    if (otpValue.length < 6) {
      return setOtpError("Please enter the complete 6-digit OTP")
    }
    setOtpError("")
    try {
      setOtpLoading(true)
     const res = await api.post("/api/auth/verify-otp", {
        email: formData.email,
        otp: otpValue,
      }, )
      login(res.data.user)
      navigate("/dashboard")
    } catch (err) {
      setOtpError(err.response?.data?.message || "Invalid OTP")
      // shake effect — clear and refocus
      setOtp(["", "", "", "", "", ""])
      setTimeout(() => otpRefs.current[0]?.focus(), 100)
    } finally {
      setOtpLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0F1E] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-[#111827] rounded-2xl overflow-hidden flex shadow-2xl border border-white/10">

        {/* Left Side */}
        <div className="hidden md:flex w-1/2 bg-[#0D1321] flex-col justify-between p-10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00D4AA]/10 to-transparent" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#00D4AA]/10 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-8">
              <span className="text-2xl">🚀</span>
              <span className="text-white font-bold text-xl">SmartHire</span>
            </div>
            <h2 className="text-white text-2xl font-semibold leading-snug mb-8">
              Start your AI-powered job search journey today.
            </h2>
            <div className="space-y-4">
              {[
                "AI matches you to the best jobs instantly",
                "Auto-generated cover letters in seconds",
                "Track all applications in one place",
              ].map((benefit, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#00D4AA]/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-[#00D4AA] text-xs">✓</span>
                  </div>
                  <p className="text-[#94A3B8] text-sm">{benefit}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-[#94A3B8] text-sm italic">
              "I got 3 interview calls in my first week using SmartHire. The AI cover letters are incredible!"
            </p>
            <div className="flex items-center gap-3 mt-3">
              <div className="w-8 h-8 rounded-full bg-[#00D4AA]/20 flex items-center justify-center text-[#00D4AA] text-xs font-bold">
                PK
              </div>
              <div>
                <p className="text-white text-xs font-semibold">Priya Kumar</p>
                <p className="text-[#94A3B8] text-xs">SOFTWARE ENGINEER</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <h1 className="text-white text-3xl font-bold mb-1">Create account</h1>
          <p className="text-[#94A3B8] text-sm mb-6">Start your AI-powered career journey.</p>

          {/* Google Button */}
          <button className="w-full flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-white py-3 rounded-lg hover:bg-white/10 transition mb-4">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 my-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[#94A3B8] text-xs">OR</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[#94A3B8] text-sm mb-1 block">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                disabled={otpSent}
                className="w-full bg-white/5 border border-white/10 text-white placeholder-[#4B5563] rounded-lg py-3 px-4 focus:outline-none focus:border-[#00D4AA] transition disabled:opacity-50"
              />
            </div>

            <div>
              <label className="text-[#94A3B8] text-sm mb-1 block">Email</label>
              <input
                type="email"
                placeholder="name@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={otpSent}
                className="w-full bg-white/5 border border-white/10 text-white placeholder-[#4B5563] rounded-lg py-3 px-4 focus:outline-none focus:border-[#00D4AA] transition disabled:opacity-50"
              />
            </div>

            <div>
              <label className="text-[#94A3B8] text-sm mb-1 block">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 6 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  disabled={otpSent}
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-[#4B5563] rounded-lg py-3 px-4 pr-10 focus:outline-none focus:border-[#00D4AA] transition disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-white"
                >
                  {showPassword ? "👁" : "👁‍🗨"}
                </button>
              </div>
              {formData.password.length > 0 && !otpSent && (
                <div className="mt-2">
                  <div className="h-1 w-full bg-white/10 rounded-full">
                    <div
                      className="h-1 rounded-full transition-all duration-300"
                      style={{ width: strength.width, backgroundColor: strength.color }}
                    />
                  </div>
                  <p className="text-xs mt-1" style={{ color: strength.color }}>{strength.label}</p>
                </div>
              )}
            </div>

            <div>
              <label className="text-[#94A3B8] text-sm mb-1 block">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  disabled={otpSent}
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-[#4B5563] rounded-lg py-3 px-4 pr-10 focus:outline-none focus:border-[#00D4AA] transition disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-white"
                >
                  {showConfirm ? "👁" : "👁‍🗨"}
                </button>
              </div>
              {formData.confirmPassword.length > 0 && !otpSent && (
                <p className={`text-xs mt-1 ${formData.password === formData.confirmPassword ? "text-[#00D4AA]" : "text-[#FF4D6D]"}`}>
                  {formData.password === formData.confirmPassword ? "✓ Passwords match" : "✗ Passwords do not match"}
                </p>
              )}
            </div>

            {error && (
              <div className="bg-[#FF4D6D]/10 border border-[#FF4D6D]/30 text-[#FF4D6D] text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {!otpSent && (
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#00D4AA] to-[#0099FF] text-white font-semibold py-3 rounded-lg hover:opacity-90 transition disabled:opacity-60"
              >
                {loading ? "Sending OTP..." : "Create Account"}
              </button>
            )}
          </form>

          {/* OTP Section — slides in after signup */}
          {otpSent && (
            <div className="mt-5 border border-[#00D4AA]/30 bg-[#00D4AA]/5 rounded-xl p-5 animate-fade-in">
              <div className="flex items-center justify-between mb-1">
                <p className="text-white text-sm font-semibold">Verify your email</p>
                <span className="text-[#94A3B8] text-xs">
                  {canResend ? (
                    <button onClick={handleResend} className="text-[#00D4AA] hover:underline">
                      Resend OTP
                    </button>
                  ) : (
                    <span>Resend in <span className="text-white font-medium">{timer}s</span></span>
                  )}
                </span>
              </div>
              <p className="text-[#94A3B8] text-xs mb-4">
                We sent a 6-digit code to <span className="text-white">{formData.email}</span>
              </p>

              {/* 6 OTP boxes */}
              <div className="flex gap-2 mb-4" onPaste={handleOtpPaste}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (otpRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-10 h-12 text-center text-white text-lg font-bold bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#00D4AA] transition"
                  />
                ))}
              </div>

              {otpError && (
                <p className="text-[#FF4D6D] text-xs mb-3">{otpError}</p>
              )}

              <button
                onClick={handleVerifyOTP}
                disabled={otpLoading}
                className="w-full bg-gradient-to-r from-[#00D4AA] to-[#0099FF] text-white font-semibold py-3 rounded-lg hover:opacity-90 transition disabled:opacity-60"
              >
                {otpLoading ? "Verifying..." : "Verify & Continue"}
              </button>
            </div>
          )}

          <p className="text-[#94A3B8] text-sm text-center mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-[#00D4AA] hover:underline font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}