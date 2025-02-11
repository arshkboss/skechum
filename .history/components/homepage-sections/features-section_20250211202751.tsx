"use client"

import { Card } from "@/components/ui/card"
import { InfinityIcon, ShieldCheck, DollarSign, Zap } from "lucide-react"

const features = [
  {
    title: "Infinite packs of consistent images in unique styles",
    description: "Generate unlimited illustrations with consistent style and quality",
    icon: InfinityIcon,
    gradient: "from-violet-500 to-purple-500",
    image: "/features/styles-preview.svg"
  },
  {
    title: "Worry-free illustrations, safe for commercial use",
    description: "100% royalty-free images with full commercial usage rights",
    icon: ShieldCheck,
    gradient: "from-emerald-500 to-green-500",
    image: "/features/commercial-use.svg"
  },
  {
    title: "Cheaper than hiring an illustrator",
    description: "Professional quality illustrations at a fraction of the cost",
    icon: DollarSign,
    gradient: "from-blue-500 to-violet-500",
    image: "/features/cost-comparison.svg"
  },
  {
    title: "Faster than hiring an artist",
    description: "Get high-quality illustrations in minutes, not weeks",
    icon: Zap,
    gradient: "from-pink-500 to-rose-500",
    image: "/features/speed-comparison.svg"
  }
]

export function FeaturesSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="relative overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow"
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-10`} />
              
              {/* Content */}
              <div className="relative p-6">
                <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-lg bg-gradient-to-br from-background to-muted">
                  <feature.icon className="w-6 h-6 text-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2 leading-tight">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>

              {/* Feature Image */}
              <div className="relative h-40 mt-4 bg-muted/50">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
} 