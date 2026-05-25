// client/src/components/landing/Testimonials.jsx

const testimonials = [
  {
    name: "Arun Sharma",
    role: "Software Engineer",
    company: "Hired at Microsoft",
    initials: "AS",
    text: "SmartHire applied to 50+ jobs in a week. I got 6 interview calls without lifting a finger. This is the future.",
    stars: 5,
  },
  {
    name: "Priya Kumar",
    role: "Data Scientist",
    company: "Hired at Google",
    initials: "PK",
    text: "The AI cover letters were so good, recruiters thought I spent hours on each one. I landed my dream role in 3 weeks.",
    stars: 5,
  },
  {
    name: "Rahul Verma",
    role: "Product Manager",
    company: "Hired at Flipkart",
    initials: "RV",
    text: "The ATS checker alone is worth it. My resume went from 40% to 92% ATS score. Interview requests tripled.",
    stars: 5,
  },
]

export default function Testimonials() {
  return (
    <section id="testimonials" className="bg-[#0A0F1E] py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[#00D4AA] text-sm font-medium mb-3">TESTIMONIALS</p>
          <h2 className="text-white text-4xl font-bold mb-4">
            Trusted by{" "}
            <span className="bg-gradient-to-r from-[#00D4AA] to-[#0099FF] bg-clip-text text-transparent">
              10,000+ Professionals
            </span>
          </h2>
          <p className="text-[#94A3B8] max-w-xl mx-auto text-sm">
            Real results from real job seekers who used SmartHire to land their dream roles.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-[#111827] border border-white/10 rounded-2xl p-6 hover:border-[#00D4AA]/20 transition"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array(t.stars).fill(0).map((_, i) => (
                  <span key={i} className="text-[#FFB800] text-sm">★</span>
                ))}
              </div>

              <p className="text-[#94A3B8] text-sm leading-relaxed mb-6 italic">
                "{t.text}"
              </p>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#00D4AA]/20 flex items-center justify-center text-[#00D4AA] text-sm font-bold">
                  {t.initials}
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{t.name}</p>
                  <p className="text-[#94A3B8] text-xs">{t.role} · {t.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}