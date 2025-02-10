import React from 'react'
import { PricingCard } from '../pricing-card'
import { pricingPlans } from '@/constants/pricing'

function pricing() {
  return (
    <section className="w-full bg-muted/50 py-24">
        <div className="px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
          
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl font-bold">No subscription. No hidden fees.</h1>
            <p className="text-xl text-muted-foreground">Pay only when you <span className="text-red-500 font-bold">skechum</span> an image.</p>
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
  )
}

export default pricing