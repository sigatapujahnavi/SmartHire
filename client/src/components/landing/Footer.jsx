// client/src/components/landing/Footer.jsx
import { Link } from "react-router-dom"

const links = {
  Platform: ["Features", "Pricing", "API Docs", "Case Studies"],
  Resources: ["Career Blog", "Resume Tips", "Cover Letter Guide"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
}

export default function Footer() {
  return (
    <footer className="bg-[#0A0F1E] border-t border-white/10 px-6 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">🚀</span>
              <span className="text-white font-bold text-lg">SmartHire</span>
            </div>
            <p className="text-[#94A3B8] text-sm leading-relaxed max-w-xs">
              AI-powered job search that finds, applies, and tracks opportunities so you can focus on landing the role.
            </p>
            {/* Social */}
            <div className="flex gap-3 mt-6">
              {["𝕏", "in", "gh"].map((icon) => (
                <button
                  key={icon}
                  className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-[#94A3B8] hover:text-white hover:border-white/30 text-xs font-bold transition flex items-center justify-center"
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <p className="text-white text-sm font-semibold mb-4">{category}</p>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-[#94A3B8] hover:text-white text-sm transition">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#94A3B8] text-xs">
            © 2026 SmartHire. All rights reserved. Built with AI by Jahnavi.
          </p>
          <p className="text-[#94A3B8] text-xs">
            🤖 Powered by Claude AI
          </p>
        </div>
      </div>
    </footer>
  )
}