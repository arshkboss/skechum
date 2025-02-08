import { ArrowRight} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PricingCard } from "@/components/pricing-card"
import { FaqSection } from "@/components/faq-section"
import { FeatureGrid } from "@/components/feature-grid"

// Import sections
import RecentCreations from "@/components/sections/recent-creations"
import Testimonials from "@/components/sections/testimonials"

// Import constants


import { pricingPlans } from "@/constants/pricing"
import Pricing from "@/components/sections/pricing"


export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="w-full px-4 md:px-6 lg:px-8 py-24">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl py-12" >
              Transform Your Ideas Into
              <span className="text-primary"> Beautiful Art</span>
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl pb-8">
              Create stunning illustrations in seconds using advanced AI. Choose your style and watch your imagination come to life.
            </p>
            <div className="flex justify-center gap-4 py-8">
              <Link href="/create">
                <Button size="lg">
                  Create Now for Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/explore">
                <Button variant="outline" size="lg">
                  View Gallery
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

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