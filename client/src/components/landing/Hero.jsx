// client/src/components/landing/Hero.jsx
import { Link } from "react-router-dom"

export default function Hero() {
  return (
    <section className="min-h-screen bg-[#0A0F1E] flex items-center pt-20 px-6 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[#00D4AA]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-[#0099FF]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center">
        {/* Left */}
        <div>
          <div className="inline-flex items-center gap-2 bg-[#00D4AA]/10 border border-[#00D4AA]/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#00D4AA] animate-pulse" />
            <span className="text-[#00D4AA] text-xs font-medium">AI-Powered Job Search</span>
          </div>

          <h1 className="text-white text-5xl md:text-6xl font-bold leading-tight mb-6">
            Land your dream job with{" "}
            <span className="bg-gradient-to-r from-[#00D4AA] to-[#0099FF] bg-clip-text text-transparent">
              AI Precision.
            </span>
          </h1>

          <p className="text-[#94A3B8] text-lg leading-relaxed mb-8 max-w-lg">
            The ultimate career platform that analyzes your real profile, finds the hidden opportunities, and auto-applies with professional cover letters every time.
          </p>

          <div className="flex items-center gap-4 flex-wrap">
            <Link
              to="/signup"
              className="bg-gradient-to-r from-[#00D4AA] to-[#0099FF] text-white font-semibold px-8 py-3.5 rounded-xl hover:opacity-90 transition text-sm"
            >
              Start For Free
            </Link>
            <a
              href="#how-it-works"
              className="text-[#94A3B8] hover:text-white text-sm flex items-center gap-2 transition"
            >
              <span className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-xs">▶</span>
              Watch Demo
            </a>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8 mt-10">
            {[
              { value: "10K+", label: "Jobs Applied" },
              { value: "94%", label: "Success Rate" },
              { value: "3x", label: "More Interviews" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-white text-2xl font-bold">{stat.value}</p>
                <p className="text-[#94A3B8] text-xs">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Dashboard mockup */}
        <div className="relative hidden md:block">
          <div className="bg-[#111827] border border-white/10 rounded-2xl p-4 shadow-2xl">
            {/* Fake browser bar */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-[#FF4D6D]/60" />
              <div className="w-3 h-3 rounded-full bg-[#FFB800]/60" />
              <div className="w-3 h-3 rounded-full bg-[#00D4AA]/60" />
              <div className="flex-1 bg-white/5 rounded-md h-5 ml-2" />
            </div>

            {/* Fake dashboard UI */}
            <div className="space-y-3">
              <div className="bg-[#0D1321] rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-semibold">Applications Today</p>
                  <p className="text-[#00D4AA] text-2xl font-bold">24</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-[#00D4AA]/20 flex items-center justify-center text-xl">🤖</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Interviews", value: "6", color: "#00D4AA" },
                  { label: "Responses", value: "18", color: "#0099FF" },
                ].map((item) => (
                  <div key={item.label} className="bg-[#0D1321] rounded-xl p-3">
                    <p className="text-[#94A3B8] text-xs">{item.label}</p>
                    <p className="text-white text-xl font-bold" style={{ color: item.color }}>{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Fake job list */}
              {[
                { company: "Google", role: "Frontend Engineer", status: "Applied", color: "#00D4AA" },
                { company: "Anthropic", role: "AI Engineer", status: "Interview", color: "#0099FF" },
                { company: "Stripe", role: "Full Stack Dev", status: "Applied", color: "#00D4AA" },
              ].map((job) => (
                <div key={job.company} className="bg-[#0D1321] rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <p className="text-white text-xs font-semibold">{job.company}</p>
                    <p className="text-[#94A3B8] text-xs">{job.role}</p>
                  </div>
                  <span
                    className="text-xs px-2 py-1 rounded-full font-medium"
                    style={{ backgroundColor: `${job.color}20`, color: job.color }}
                  >
                    {job.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Floating badge */}
          <div className="absolute -bottom-4 -left-4 bg-[#111827] border border-white/10 rounded-xl px-4 py-2 flex items-center gap-2 shadow-xl">
            <span className="text-lg">✉️</span>
            <div>
              <p className="text-white text-xs font-semibold">Cover letter sent!</p>
              <p className="text-[#94A3B8] text-xs">Anthropic • 2s ago</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}