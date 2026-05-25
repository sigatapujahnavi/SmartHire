// client/src/components/landing/Features.jsx

const features = [
  {
    icon: "🎯",
    title: "Smart Job Matching",
    description: "Our AI analyzes your skills, experience, and preferences to find jobs that perfectly match your profile — not just keywords.",
  },
  {
    icon: "✍️",
    title: "Auto Cover Letters",
    description: "Generate professional, personalized cover letters in seconds. Tailored to each job description automatically.",
  },
  {
    icon: "📄",
    title: "ATS Resume Checker",
    description: "Ensure your resume passes Applicant Tracking Systems with our real-time ATS score and optimization tips.",
  },
  {
    icon: "📊",
    title: "Application Tracker",
    description: "Track every application in one place. Know exactly where you stand with each company at every stage.",
  },
]

export default function Features() {
  return (
    <section id="features" className="bg-[#0A0F1E] py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[#00D4AA] text-sm font-medium mb-3">WHY SMARTHIRE</p>
          <h2 className="text-white text-4xl font-bold mb-4">
            Powerful Features for the{" "}
            <span className="bg-gradient-to-r from-[#00D4AA] to-[#0099FF] bg-clip-text text-transparent">
              Modern Job Hunter
            </span>
          </h2>
          <p className="text-[#94A3B8] max-w-xl mx-auto text-sm leading-relaxed">
            Stop wasting hours on repetitive applications. Let our AI handle the heavy lifting so you can focus on what matters.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-[#111827] border border-white/10 rounded-2xl p-6 hover:border-[#00D4AA]/30 transition group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#00D4AA]/10 flex items-center justify-center text-2xl mb-4 group-hover:bg-[#00D4AA]/20 transition">
                {feature.icon}
              </div>
              <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
              <p className="text-[#94A3B8] text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}