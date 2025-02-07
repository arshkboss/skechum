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
    <div className="min-h-screen py-20">
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
        className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-8"
      >
        {plans.map((plan) => (
          <motion.div 
            key={plan.name}
            variants={fadeIn}
          >
            <Card className={`p-8 h-full flex flex-col ${
              plan.popular ? 'border-primary shadow-lg' : ''
            }`}>
              {plan.popular && (
                <div className="text-sm font-medium text-primary mb-4">
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
        className="mt-20 text-center"
      >
        <motion.h2 
          variants={fadeIn}
          className="text-2xl font-bold mb-4"
        >
          Need something different?
        </motion.h2>
        <motion.p 
          variants={fadeIn}
          className="text-muted-foreground mb-8"
        >
          Contact us for custom packages tailored to your needs
        </motion.p>
        <motion.div variants={fadeIn}>
          <Button asChild variant="outline" size="lg" className="rounded-full">
            <Link href="/contact">Contact Sales</Link>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
} 