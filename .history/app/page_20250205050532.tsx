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
      <section className="w-full bg-muted/50 py-16">
        <div className="px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Recent Creations</h2>
          <div className="relative">
            {/* Fade Overlays */}
            <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-muted/50 to-transparent z-10" />
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-muted/50 to-transparent z-10" />
            
            {/* Auto-scrolling Container */}
            <div className="grid grid-cols-4 gap-4 h-[500px] overflow-hidden">
              {/* Column 1 */}
              <div className="animate-scroll space-y-4">
                {[...recentGenerations, ...recentGenerations].slice(0, 8).map((art, i) => (
                  <div key={`${art.id}-${i}`} className="relative aspect-square w-full max-w-[200px]">
                    <img
                      src={art.imageUrl}
                      alt={art.prompt}
                      className="object-cover w-full h-full rounded-md shadow-sm"
                    />
                  </div>
                ))}
              </div>
              
              {/* Column 2 */}
              <div className="animate-scroll-delayed space-y-4 pt-12">
                {[...recentGenerations, ...recentGenerations].slice(4, 12).map((art, i) => (
                  <div key={`${art.id}-${i}`} className="relative aspect-square w-full max-w-[200px]">
                    <img
                      src={art.imageUrl}
                      alt={art.prompt}
                      className="object-cover w-full h-full rounded-md shadow-sm"
                    />
                  </div>
                ))}
              </div>
              
              {/* Column 3 */}
              <div className="animate-scroll-more-delayed space-y-4 pt-24">
                {[...recentGenerations, ...recentGenerations].slice(2, 10).map((art, i) => (
                  <div key={`${art.id}-${i}`} className="relative aspect-square w-full max-w-[200px]">
                    <img
                      src={art.imageUrl}
                      alt={art.prompt}
                      className="object-cover w-full h-full rounded-md shadow-sm"
                    />
                  </div>
                ))}
              </div>

              {/* Column 4 */}
              <div className="animate-scroll-most-delayed space-y-4 pt-36">
                {[...recentGenerations, ...recentGenerations].slice(3, 11).map((art, i) => (
                  <div key={`${art.id}-${i}`} className="relative aspect-square w-full max-w-[200px]">
                    <img
                      src={art.imageUrl}
                      alt={art.prompt}
                      className="object-cover w-full h-full rounded-md shadow-sm"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

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