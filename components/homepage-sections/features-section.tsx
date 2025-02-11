"use client"

import { motion } from "framer-motion"
import { InfinityIcon, ShieldCheck, DollarSign, Zap } from "lucide-react"
import Image from "next/image"

const features = [
  {
    number: "01",
    title: "Infinite packs of consistent images",
    description: "Generate unlimited illustrations with consistent style and quality",
    icon: InfinityIcon,
    image: "/features/illustration-1.svg",
  },
  {
    number: "02",
    title: "Worry-free commercial illustrations",
    description: "100% royalty-free images with full commercial usage rights",
    icon: ShieldCheck,
    image: "/features/illustration-2.svg",
  },
  {
    number: "03",
    title: "Cheaper than hiring an illustrator",
    description: "Professional quality illustrations at a fraction of the cost",
    icon: DollarSign,
    image: "/features/illustration-3.svg",
  },
  {
    number: "04",
    title: "Faster than hiring an artist",
    description: "Get high-quality illustrations in minutes, not weeks",
    icon: Zap,
    image: "/features/illustration-4.svg",
  }
]

const slideIn = (direction: "left" | "right") => ({
  hidden: { 
    opacity: 0, 
    x: direction === "left" ? -30 : 30 
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.8, 
      ease: "easeOut" 
    }
  }
})

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

export function FeaturesSection() {
  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="space-y-24">
          {features.map((feature, i) => (
            <motion.div 
              key={feature.number}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={stagger}
              className={`flex flex-col ${
                i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              } items-center gap-8 md:gap-16`}
            >
              <motion.div 
                variants={slideIn(i % 2 === 0 ? "left" : "right")}
                className="flex-1 space-y-4"
              >
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 0.2, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="text-6xl font-bold text-primary/20"
                >
                  {feature.number}
                </motion.div>
                <div className="flex items-center gap-3">
                  <feature.icon className="w-5 h-5 text-primary" />
                  <h3 className="text-2xl font-bold">{feature.title}</h3>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
              <motion.div 
                variants={slideIn(i % 2 === 0 ? "right" : "left")}
                className="flex-1"
              >
                <Image
                  src={feature.image}
                  alt={feature.title}
                  width={500}
                  height={400}
                  className="w-full"
                />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 