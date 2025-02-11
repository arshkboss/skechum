"use client"

import { motion } from "framer-motion"
import { InfinityIcon, ShieldCheck, DollarSign, Zap } from "lucide-react"

const features = [
  {
    title: "Infinite packs of consistent images in unique styles",
    description: "Generate unlimited illustrations with consistent style and quality",
    icon: InfinityIcon,
    gradient: "bg-gradient-to-br from-violet-500/20 to-purple-500/20",
    align: "left"
  },
  {
    title: "Worry-free illustrations, safe for commercial use",
    description: "100% royalty-free images with full commercial usage rights",
    icon: ShieldCheck,
    gradient: "bg-gradient-to-br from-emerald-500/20 to-green-500/20",
    align: "right"
  },
  {
    title: "Cheaper than hiring an illustrator",
    description: "Professional quality illustrations at a fraction of the cost",
    icon: DollarSign,
    gradient: "bg-gradient-to-br from-blue-500/20 to-violet-500/20",
    align: "left"
  },
  {
    title: "Faster than hiring an artist",
    description: "Get high-quality illustrations in minutes, not weeks",
    icon: Zap,
    gradient: "bg-gradient-to-br from-pink-500/20 to-rose-500/20",
    align: "right"
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
}

export function FeaturesSection() {
  return (
    <section className="py-24 overflow-hidden">
      <motion.div 
        className="container px-4 md:px-6 space-y-24"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className={`flex flex-col ${feature.align === 'right' ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-8 md:gap-12`}
          >
            {/* Text Content */}
            <div className={`w-full md:w-1/2 ${feature.align === 'right' ? 'md:text-right' : 'md:text-left'} space-y-4`}>
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${feature.gradient}`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-lg">
                {feature.description}
              </p>
            </div>

            {/* Feature Illustration */}
            <div className="w-full md:w-1/2">
              <div className={`aspect-[4/3] relative rounded-2xl overflow-hidden ${feature.gradient} p-6`}>
                <img
                  src={`/images/features/illustration-${index + 1}.svg`}
                  alt={feature.title}
                  className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-plus-lighter"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
} 