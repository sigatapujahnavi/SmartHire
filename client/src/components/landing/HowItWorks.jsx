// client/src/components/landing/HowItWorks.jsx

const steps = [
  {
    number: "01",
    title: "Connect Profile",
    description: "Upload your resume and connect your LinkedIn. Our AI builds a complete picture of your skills and experience.",
    icon: "👤",
  },
  {
    number: "02",
    title: "Apply With AI",
    description: "Set your job preferences. The agent finds matching roles and applies with tailored cover letters automatically.",
    icon: "🤖",
  },
  {
    number: "03",
    title: "Secure Offers",
    description: "Get interview requests straight to your inbox. Track every opportunity and land your dream role.",
    icon: "🎉",
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-[#0D1321] py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[#00D4AA] text-sm font-medium mb-3">THE PROCESS</p>
          <h2 className="text-white text-4xl font-bold mb-4">
            Three Steps to Your{" "}
            <span className="bg-gradient-to-r from-[#00D4AA] to-[#0099FF] bg-clip-text text-transparent">
              New Career
            </span>
          </h2>
          <p className="text-[#94A3B8] max-w-xl mx-auto text-sm leading-relaxed">
            From profile to offer — our AI handles everything in between.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-px bg-gradient-to-r from-[#00D4AA]/30 via-[#0099FF]/30 to-[#00D4AA]/30" />

          {steps.map((step, i) => (
            <div key={step.number} className="relative text-center">
              {/* Step number circle */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00D4AA]/20 to-[#0099FF]/20 border border-[#00D4AA]/30 flex items-center justify-center mx-auto mb-6 relative z-10">
                <span className="text-3xl">{step.icon}</span>
              </div>
              <span className="text-[#00D4AA] text-xs font-bold tracking-widest">{step.number}</span>
              <h3 className="text-white text-xl font-semibold mt-1 mb-3">{step.title}</h3>
              <p className="text-[#94A3B8] text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}