"use client"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wallet, Wand2 } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"
import PencilLoader from "@/components/ui/pencil-loader"
import { useState, useEffect } from "react"

export function HowItWorksSection() {
  const [showPreview, setShowPreview] = useState(false)

  // Simulate preview loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPreview(true)
    }, 3000) // Show preview after 3 seconds

    return () => clearTimeout(timer)
  }, [])

  // Demo style options for the style selector step
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
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How Illustration Generator works
          </h2>
          <p className="text-lg text-muted-foreground">
            Three easy steps to transform your ideas into professional illustrations.
          </p>
        </div>

        <div className="relative flex flex-col gap-24 max-w-4xl mx-auto">
          {/* Connecting Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/20 via-primary/40 to-transparent -translate-x-1/2 hidden md:block" />

          {/* Step 1: Prompt Input */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="relative md:w-[90%] md:ml-auto"
          >
            <span className="absolute -top-4 -left-4 bg-primary text-primary-foreground text-lg font-medium w-8 h-8 rounded-full flex items-center justify-center z-10">
              1
            </span>
            <Card className="p-6 border border-muted">
              <div className="bg-muted/50 rounded-lg p-6">
                <div className="max-w-2xl mx-auto space-y-4">
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
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="relative md:w-[90%]"
          >
            <span className="absolute -top-4 -left-4 bg-primary text-primary-foreground text-lg font-medium w-8 h-8 rounded-full flex items-center justify-center z-10">
              2
            </span>
            <Card className="p-6 border border-muted">
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
                  <div className="grid grid-cols-3 gap-3">
                    {demoStyles.map((style) => (
                      <Button
                        key={style.id}
                        variant="outline"
                        className="h-auto p-2 flex flex-col items-stretch"
                      >
                        <div className="relative w-full aspect-[3/2] mb-2">
                          <Image
                            src={style.img}
                            alt={style.name}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                        <span className="text-sm font-medium">{style.name}</span>
                        <span className="text-xs text-muted-foreground">{style.description}</span>
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
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="relative md:w-[90%] md:ml-auto"
          >
            <span className="absolute -top-4 -left-4 bg-primary text-primary-foreground text-lg font-medium w-8 h-8 rounded-full flex items-center justify-center z-10">
              3
            </span>
            <Card className="p-6 border border-muted">
              <div className="bg-muted/50 rounded-lg p-6">
                <div className="space-y-4">
                  <div className="bg-background border rounded-lg p-4">
                    <div className="aspect-[16/9] relative flex items-center justify-center">
                      {!showPreview ? (
                        <div className="w-24 h-24">
                          <PencilLoader />
                        </div>
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