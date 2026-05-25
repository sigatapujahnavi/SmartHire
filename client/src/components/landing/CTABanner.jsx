// client/src/components/landing/CTABanner.jsx
import { Link } from "react-router-dom"

export default function CTABanner() {
  return (
    <section className="bg-[#0D1321] py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-gradient-to-br from-[#00D4AA]/10 to-[#0099FF]/10 border border-[#00D4AA]/20 rounded-3xl p-12 relative overflow-hidden">
          {/* Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-[#00D4AA]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <h2 className="text-white text-4xl font-bold mb-4">
              Ready to upgrade your career?
            </h2>
            <p className="text-[#94A3B8] mb-8 max-w-md mx-auto text-sm leading-relaxed">
              Join thousands of job seekers who landed their dream roles using SmartHire's AI agent. Free to start.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link
                to="/signup"
                className="bg-gradient-to-r from-[#00D4AA] to-[#0099FF] text-white font-semibold px-8 py-3.5 rounded-xl hover:opacity-90 transition text-sm"
              >
                Get Started Free
              </Link>
              <Link
                to="/login"
                className="text-[#94A3B8] hover:text-white text-sm border border-white/10 px-8 py-3.5 rounded-xl hover:border-white/30 transition"
              >
                Sign In
              </Link>
            </div>
            <p className="text-[#94A3B8] text-xs mt-4">No credit card required · Free forever plan available</p>
          </div>
        </div>
      </div>
    </section>
  )
}