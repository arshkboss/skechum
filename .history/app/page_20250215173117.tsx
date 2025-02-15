// Import sections
import RecentCreations from "@/components/homepage-sections/recent-creations"
import Testimonials from "@/components/homepage-sections/testimonials"
import { FaqSection } from "@/components/homepage-sections/faq-section"

import Pricing from "@/components/homepage-sections/pricing"
import HeroSection from "@/components/homepage-sections/hero-section"
import StylesSection from "@/components/homepage-sections/styles-section"
import { HowItWorksSection } from "@/components/homepage-sections/how-it-works"
import { FeaturesSection } from "@/components/homepage-sections/features-section"

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <HeroSection />


      {/* How It Works Section */}
      <HowItWorksSection />


      {/* Features Section */}
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

      
    </>
  )
} 