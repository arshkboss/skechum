"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

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

const plans = [
  {
    name: "Free",
    price: "0",
    description: "Perfect for trying out Skechum",
    features: [
      "5 free credits monthly",
      "Basic art styles",
      "Standard resolution",
      "Community support",
    ],
    cta: "Get Started",
    href: "/sign-up",
    popular: false,
  },
  {
    name: "Pro",
    price: "10",
    description: "For creators who need more power",
    features: [
      "50 credits monthly",
      "All art styles",
      "High resolution",
      "Priority support",
      "Commercial usage",
      "Advanced customization",
    ],
    cta: "Upgrade Now",
    href: "/pricing/pro",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For teams and businesses",
    features: [
      "Custom credit packages",
      "Dedicated support",
      "API access",
      "Custom styles",
      "Team management",
      "Training sessions",
    ],
    cta: "Contact Sales",
    href: "/contact",
    popular: false,
  },
]

export default function PricingPage() {
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
            {plans.map((plan) => (
              <motion.div 
                key={plan.name}
                variants={fadeIn}
              >
                <Card className={`relative p-8 h-full flex flex-col backdrop-blur-sm bg-white/50 dark:bg-gray-950/50 ${
                  plan.popular ? 'border-primary shadow-lg ring-2 ring-primary/20' : ''
                }`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full">
                      Most Popular
                    </div>
                  )}
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold">{plan.name}</h3>
                    <div className="mt-2 flex items-baseline gap-x-2">
                      <span className="text-4xl font-bold">${plan.price}</span>
                      {plan.price !== "Custom" && (
                        <span className="text-muted-foreground">/month</span>
                      )}
                    </div>
                    <p className="mt-2 text-muted-foreground">
                      {plan.description}
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
                    variant={plan.popular ? "default" : "outline"}
                    className="mt-8 w-full rounded-full"
                  >
                    <Link href={plan.href}>{plan.cta}</Link>
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
              Need something different?
            </motion.h2>
            <motion.p 
              variants={fadeIn}
              className="text-muted-foreground mb-8 relative"
            >
              Contact us for custom packages tailored to your needs
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