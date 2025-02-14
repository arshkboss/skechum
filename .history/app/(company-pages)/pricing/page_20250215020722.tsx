"use client"

import { motion } from "framer-motion"
import { PricingCard } from "@/components/pricing-card"
import { pricingPlans } from "@/constants/pricing"

const DODO_CHECKOUT_BASE_URL = "https://test.checkout.dodopayments.com/buy"

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
}

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

export default function PricingPage() {
  const getPaymentLink = (productId: string) => {
    const params = new URLSearchParams({
      quantity: "1",
      redirect_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,
    })
    return `${DODO_CHECKOUT_BASE_URL}/${productId}?${params.toString()}`
  }

  return (
    <>
      <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-gray-950">
        <div className="absolute h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex justify-center">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            transition={{ duration: 1 }}
            className="h-[310px] w-[310px] rounded-full bg-gradient-to-r from-primary to-primary-foreground blur-3xl"
          />
        </div>

        <div className="container relative min-h-screen py-20">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="text-center space-y-4 mb-16"
          >
            <motion.h1 
              variants={fadeIn}
              className="text-4xl md:text-6xl font-bold tracking-tight"
            >
              Simple, transparent pricing
            </motion.h1>
            <motion.p 
              variants={fadeIn}
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              No monthly fees. No hidden costs. Pay only when you <span className="text-red-500 font-bold">skechum</span> an image.
            </motion.p>
          </motion.div>

          <motion.div 
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="grid md:grid-cols-3 gap-8"
          >
            {pricingPlans.map((plan) => (
              <motion.div key={plan.credits} variants={fadeIn}>
                <PricingCard 
                  {...plan}
                  checkoutUrl={getPaymentLink(plan.productId)}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </>
  )
} 