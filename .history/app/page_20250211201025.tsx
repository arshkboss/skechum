// Import sections
import RecentCreations from "@/components/sections/recent-creations"
import Testimonials from "@/components/sections/testimonials"
import { FaqSection } from "@/components/sections/faq-section"

import Pricing from "@/components/sections/pricing"
import HeroSection from "@/components/sections/hero-section"
import StylesSection from "@/components/sections/styles-section"
import { HowItWorksSection } from "@/components/sections/how-it-works"
import { FeaturesSection } from "@/components/sections/features-section"

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <HeroSection />
      <FeaturesSection />

      {/* Available Styles */}
      <StylesSection />

      {/* Recent Generations */}
      <RecentCreations />
   

      {/* Testimonials */}
      <Testimonials />
        

      {/* Pricing Section */}
      <Pricing />

      {/* FAQ Section */}
      <section className="w-full py-24">
        <div className="px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
          <FaqSection />
        </div>
      </section>

      <HowItWorksSection />
    </>
  )
} 