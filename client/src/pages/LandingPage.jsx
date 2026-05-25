// client/src/pages/LandingPage.jsx
import Navbar from "../components/landing/Navbar"
import Hero from "../components/landing/Hero"
import Features from "../components/landing/Features"
import HowItWorks from "../components/landing/HowItWorks"
import Testimonials from "../components/landing/Testimonials"
import CTABanner from "../components/landing/CTABanner"
import Footer from "../components/landing/Footer"

export default function LandingPage() {
  return (
    <div className="bg-[#0A0F1E]">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CTABanner />
      <Footer />
    </div>
  )
}