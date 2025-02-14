"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { pricingPlans } from "@/constants"
import Image from "next/image"

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

const DODO_CHECKOUT_BASE_URL = "https://checkout.dodopayments.com/buy"
const PRODUCT_ID_150_TOKENS = "pdt_euU2AfE7iRo3EFQtAkcBm"

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
      {/* Gradient Background */}
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
              Choose the perfect plan for your creative journey
            </motion.p>
          </motion.div>

          <motion.div 
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="grid md:grid-cols-3 gap-8"
          >
            {pricingPlans.map((plan) => (
              <motion.div 
                key={plan.credits}
                variants={fadeIn}
              >
                <Card className={`relative p-8 h-full flex flex-col backdrop-blur-sm bg-white/50 dark:bg-gray-950/50 ${
                  plan.isPopular ? 'border-primary shadow-lg ring-2 ring-primary/20' : ''
                }`}>
                  {plan.isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full">
                      Most Popular
                    </div>
                  )}
                  <div className="mb-6">
                    <Image
                      src={plan.image}
                      alt={plan.imageAlt}
                      width={64}
                      height={64}
                      className="mb-4"
                    />
                    <h3 className="text-2xl font-bold">{plan.credits} Credits</h3>
                    <div className="mt-2 flex items-baseline gap-x-2">
                      <span className="text-4xl font-bold">${plan.price}</span>
                      <span className="text-muted-foreground">/one-time</span>
                    </div>
                    {plan.originalPrice && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        <span className="line-through">${plan.originalPrice}</span>
                        {" "}Save {Math.round((1 - plan.price/plan.originalPrice) * 100)}%
                      </p>
                    )}
                    <p className="mt-2 text-sm text-muted-foreground">
                      ${plan.pricePerCredit.toFixed(3)} per credit
                    </p>
                  </div>

                  <div className="space-y-4 flex-grow">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    asChild
                    size="lg"
                    variant={plan.isPopular ? "default" : "outline"}
                    className="mt-8 w-full rounded-full"
                  >
                    <Link 
                      href={
                        plan.credits === 150 
                          ? getPaymentLink(PRODUCT_ID_150_TOKENS)
                          : `/checkout/${plan.credits}`
                      }
                    >
                      Get Started
                    </Link>
                  </Button>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="mt-20 text-center relative"
          >
            <div className="absolute inset-0 flex justify-center">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.1 }}
                transition={{ duration: 1 }}
                className="h-[200px] w-[200px] rounded-full bg-gradient-to-r from-primary to-primary-foreground blur-3xl"
              />
            </div>
            <motion.h2 
              variants={fadeIn}
              className="text-2xl font-bold mb-4 relative"
            >
              Need more credits?
            </motion.h2>
            <motion.p 
              variants={fadeIn}
              className="text-muted-foreground mb-8 relative"
            >
              Contact us for custom packages and enterprise solutions
            </motion.p>
            <motion.div variants={fadeIn} className="relative">
              <Button asChild variant="outline" size="lg" className="rounded-full">
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  )
} 