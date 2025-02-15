"use client"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wallet, Wand2 } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

export function HowItWorksSection() {
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPreview(true)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  const demoStyles = [
    {
      id: "doodle",
      name: "Doodle",
      description: "Playful vibrant doodle art",
      img: "/styles/color_doodle.png"
    },
    {
      id: "line-art",
      name: "Line Art",
      description: "Simple b&w line drawings",
      img: "/styles/notion-minimal.png"
    },
    {
      id: "watercolor",
      name: "Watercolor",
      description: "Artistic watercolor style",
      img: "/styles/watercolor.png"
    }
  ]

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How Illustration Generator works
          </h2>
          <p className="text-lg text-muted-foreground">
            Three easy steps to transform your ideas into professional illustrations.
          </p>
        </div>

        {/* Grid layout for desktop, stack for mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
          {/* Step 1: Prompt Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-6 border border-muted h-full">
              <div className="bg-muted/50 rounded-lg p-6 flex-1">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Prompt</label>
                    <div className="flex gap-2">
                      <Input 
                        value="group of people dancing"
                        className="w-full"
                        disabled
                      />
                      <Button disabled>
                        <Wand2 className="w-4 h-4 mr-2" />
                        Generate
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-semibold mb-2">
                  Enter a prompt to generate an illustration
                </h3>
                <p className="text-muted-foreground">
                  Describe what you want to create in a few words
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Step 2: Style Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="p-6 border border-muted h-full">
              <div className="bg-muted/50 rounded-lg p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Choose Style
                    </label>
                    <Badge 
                      variant="secondary" 
                      className="h-5 bg-green-100/80 text-green-700 flex items-center gap-1 px-2"
                    >
                      <Wallet className="w-3 h-3" />
                      <span>Cost: 2 credits</span>
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {demoStyles.map((style) => (
                      <Button
                        key={style.id}
                        variant="outline"
                        className="h-auto p-1.5 flex flex-col items-stretch"
                      >
                        <div className="relative w-full aspect-[3/2] mb-1.5">
                          <Image
                            src={style.img}
                            alt={style.name}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                        <span className="text-xs font-medium">{style.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-semibold mb-2">
                  Choose a style and click 'Generate'
                </h3>
                <p className="text-muted-foreground">
                  Select from various artistic styles to match your vision perfectly.
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Step 3: Result */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="p-6 border border-muted h-full">
              <div className="bg-muted/50 rounded-lg p-6">
                <div className="space-y-4">
                  <div className="bg-background border rounded-lg p-4">
                    <div className="aspect-[3/2] relative flex items-center justify-center">
                      {!showPreview ? (
                        <p className="text-sm text-muted-foreground animate-pulse">
                          Generating illustration...
                        </p>
                      ) : (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                          className="absolute inset-0"
                        >
                          <Image
                            src="/how-it-works/3.png"
                            alt="Generated illustration"
                            fill
                            className="object-contain p-4"
                          />
                        </motion.div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button className="w-full" variant="outline" disabled>
                      Download PNG
                    </Button>
                    <Button className="w-full" variant="outline" disabled>
                      Download SVG
                    </Button>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-semibold mb-2">
                  Get a high-quality illustration
                </h3>
                <p className="text-muted-foreground">
                  Download your professionally generated illustration in multiple formats.
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
} 