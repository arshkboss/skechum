import { ArrowRight} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PricingCard } from "@/components/pricing-card"
import { FaqSection } from "@/components/faq-section"
import { FeatureGrid } from "@/components/feature-grid"

// Import constants
import { recentGenerations } from "@/constants/generations"
import { testimonials } from "@/constants/testimonials"
import { pricingPlans } from "@/constants/pricing"
import RecentCreations from "@/components/sections/recent-creations"
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
      <section className="w-full py-24">
        <div className="px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold">What Our Users Say</h2>
            <p className="text-muted-foreground">Join thousands of satisfied creators</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <Card key={i} className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-sm">{testimonial.content}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="w-full bg-muted/50 py-24">
        <div className="px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
          
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl font-bold">No subscription. No hidden fees.</h1>
            <p className="text-xl text-muted-foreground">Pay only when you <span className="text-red-500 font-bold">sketchum</span> an image.</p>
            <p className="text-center text-sm text-muted-foreground mt-8">
            2 credit = 1 generation
          </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, i) => (
              <PricingCard
                key={i}
                credits={plan.credits}
                price={plan.price}
                pricePerCredit={plan.pricePerCredit}
                originalPrice={plan.originalPrice}
                isPopular={plan.isPopular}
                features={[...plan.features]}
                image={plan.image}
                imageAlt={plan.imageAlt}
              />
            ))}
          </div>
          
          
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full py-24">
        <div className="px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
          <FaqSection />
        </div>
      </section>
    </>
  )
} 