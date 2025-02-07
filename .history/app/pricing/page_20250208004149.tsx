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

export default function PricingPage() {
  return (
    <>
      {/* Background from home page */}
      <div className="absolute inset-0 -z-10 mx-0 max-w-none overflow-hidden">
        <div className="absolute left-1/2 top-0 ml-[-38rem] h-[25rem] w-[81.25rem] dark:[mask-image:linear-gradient(white,transparent)]">
          <div className="absolute inset-0 bg-gradient-to-r from-[#36b49f] to-[#DBFF75] opacity-40 [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] dark:from-[#36b49f]/30 dark:to-[#DBFF75]/30 dark:opacity-100">
            <svg
              aria-hidden="true"
              className="absolute inset-x-0 inset-y-[-50%] h-[200%] w-full skew-y-[-18deg] fill-black/40 stroke-black/50 mix-blend-overlay dark:fill-white/2.5 dark:stroke-white/5"
            >
              <defs>
                <pattern
                  id=":R56hd6:"
                  width="72"
                  height="56"
                  patternUnits="userSpaceOnUse"
                  x="-12"
                  y="4"
                >
                  <path d="M.5 56V.5H72" fill="none"></path>
                </pattern>
              </defs>
              <rect
                width="100%"
                height="100%"
                strokeWidth="0"
                fill="url(#:R56hd6:)"
              ></rect>
              <svg x="-12" y="4" className="overflow-visible">
                <rect
                  strokeWidth="0"
                  width="73"
                  height="57"
                  x="288"
                  y="168"
                ></rect>
              </svg>
            </svg>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="container relative min-h-screen py-20">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="text-center space-y-4 mb-16"
          >
            <motion.h1 
              variants={fadeIn}
              className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400"
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
                    <Link href={`/checkout/${plan.credits}`}>Get Started</Link>
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