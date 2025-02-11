import { ArrowRight} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FaqSection } from "@/components/faq-section"
import { FeatureGrid } from "@/components/feature-grid"

// Import sections
import RecentCreations from "@/components/sections/recent-creations"
import Testimonials from "@/components/sections/testimonials"

// Import constants
import Pricing from "@/components/sections/pricing"
import Hero from "@/components/sections/hero"


export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <HeroSection />

      {/* Available Styles */}
      <section className="w-full bg-muted/50 py-24">
        <div className="px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold">Available Styles</h2>
            <p className="text-muted-foreground">
              Choose from our collection of carefully crafted AI art styles
            </p>
          </div>
          
          <FeatureGrid />
        </div>
      </section>

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