import React from 'react'
import { PricingCard } from '../pricing-card'
import { pricingPlans } from '@/constants/pricing'

const DODO_CHECKOUT_BASE_URL = process.env.NEXT_PUBLIC_DODO_CHECKOUT_BASE_URL

export default function Pricing() {
  const getPaymentLink = (productId: string) => {
    const params = new URLSearchParams({
      quantity: "1",
      redirect_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,
    })
    return `${DODO_CHECKOUT_BASE_URL}/${productId}?${params.toString()}`
  }

  return (
    <section className="w-full bg-muted/50 py-24">
      <div className="px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold">No subscription. No hidden fees.</h1>
          <p className="text-xl text-muted-foreground">
            Pay only when you <span className="text-red-500 font-bold">skechum</span> an image.
          </p>
          <p className="text-center text-sm text-muted-foreground mt-8">
            2 credit = 1 generation
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan) => (
            <PricingCard
              key={plan.credits}
              {...plan}
              checkoutUrl={getPaymentLink(plan.productId)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}