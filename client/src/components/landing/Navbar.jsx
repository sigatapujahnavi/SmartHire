// client/src/components/landing/Navbar.jsx
import { Link } from "react-router-dom"
import { useState } from "react"
import { useAuth } from "../../context/AuthContext"

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user } = useAuth()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0F1E]/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-xl">🚀</span>
          <span className="text-white font-bold text-lg">SmartHire</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {["Features", "How It Works", "Pricing", "Portfolio"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(" ", "-")}`}
              className="text-[#94A3B8] hover:text-white text-sm transition"
            >
              {item}
            </a>
          ))}
        </div>

        {/* Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <Link
              to="/dashboard"
              className="bg-gradient-to-r from-[#00D4AA] to-[#0099FF] text-white text-sm font-semibold px-5 py-2 rounded-lg hover:opacity-90 transition"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-[#94A3B8] hover:text-white text-sm transition px-4 py-2"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-gradient-to-r from-[#00D4AA] to-[#0099FF] text-white text-sm font-semibold px-5 py-2 rounded-lg hover:opacity-90 transition"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#111827] border-t border-white/10 px-6 py-4 flex flex-col gap-4">
          {["Features", "How It Works", "Pricing", "Portfolio"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(" ", "-")}`}
              className="text-[#94A3B8] hover:text-white text-sm"
              onClick={() => setMenuOpen(false)}
            >
              {item}
            </a>
          ))}
          <Link to="/login" className="text-[#94A3B8] text-sm">Login</Link>
          <Link
            to="/signup"
            className="bg-gradient-to-r from-[#00D4AA] to-[#0099FF] text-white text-sm font-semibold px-5 py-2 rounded-lg text-center"
          >
            Get Started
          </Link>
        </div>
      )}
    </nav>
  )
}