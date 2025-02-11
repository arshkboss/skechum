import { FaqSection } from "@/components/faq-section"
import { FeatureGrid } from "@/components/feature-grid"

// Import sections
import RecentCreations from "@/components/sections/recent-creations"
import Testimonials from "@/components/sections/testimonials"

// Import constants
import Pricing from "@/components/sections/pricing"
import HeroSection from "@/components/sections/hero-section"


export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <HeroSection />

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
    </>
  )
} 