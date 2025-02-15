"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wallet, Wand2, Loader2 } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

export function HowItWorksSection() {
  const [typedText, setTypedText] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null)
  
  const textToType = "group of people dancing"

  // Typing animation effect
  useEffect(() => {
    let currentIndex = 0
    const typingInterval = setInterval(() => {
      if (currentIndex <= textToType.length) {
        setTypedText(textToType.slice(0, currentIndex))
        currentIndex++
      } else {
        clearInterval(typingInterval)
      }
    }, 100)

    return () => clearInterval(typingInterval)
  }, [])

  // Generate animation flow
  useEffect(() => {
    if (selectedStyle) {
      setIsGenerating(true)
      const timer = setTimeout(() => {
        setIsGenerating(false)
        setShowPreview(true)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [selectedStyle])

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
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How Illustration Generator works
          </h2>
          <p className="text-lg text-muted-foreground">
            Three easy steps to transform your ideas into professional illustrations.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
            {/* Step 1: Prompt Input */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative z-10 bg-background rounded-xl shadow-lg md:shadow-2xl p-6 md:translate-y-0"
            >
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-sm">1</span>
                  Enter your prompt
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Describe what you want to create in a few words
                </p>
                <div className="space-y-3">
                  <Input 
                    value={typedText}
                    className="w-full bg-muted/50"
                    disabled
                  />
                </div>
              </div>
            </motion.div>

            {/* Step 2: Style Selection */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative z-20 bg-background rounded-xl shadow-lg md:shadow-2xl p-6 md:translate-y-8"
            >
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-sm">2</span>
                  Choose style
                </h3>
                <div className="flex items-center gap-2 mb-4">
                  <p className="text-muted-foreground text-sm">Select your preferred art style</p>
                  <Badge 
                    variant="secondary" 
                    className="h-5 bg-green-100/80 text-green-700 flex items-center gap-1 px-2"
                  >
                    <Wallet className="w-3 h-3" />
                    <span>2 credits</span>
                  </Badge>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    {demoStyles.map((style) => (
                      <Button
                        key={style.id}
                        variant={selectedStyle === style.id ? "default" : "outline"}
                        className={`h-auto p-1.5 flex flex-col items-stretch transition-all duration-200 
                          ${selectedStyle === style.id ? 'ring-2 ring-primary ring-offset-2' : 'bg-muted/50'}`}
                        onClick={() => setSelectedStyle(style.id)}
                      >
                        <div className="relative w-full aspect-[3/2] mb-1.5 overflow-hidden rounded-md">
                          <Image
                            src={style.img}
                            alt={style.name}
                            fill
                            className="object-cover transition-transform hover:scale-105 duration-300"
                          />
                        </div>
                        <span className="text-xs font-medium">{style.name}</span>
                      </Button>
                    ))}
                  </div>
                  <Button 
                    className="w-full"
                    disabled={!selectedStyle || isGenerating}
                    onClick={() => setIsGenerating(true)}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4 mr-2" />
                        Generate
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Step 3: Result */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="relative z-30 bg-background rounded-xl shadow-lg md:shadow-2xl p-6 md:translate-y-16"
            >
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-sm">3</span>
                  Get your illustration
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Download in multiple formats
                </p>
                <div className="space-y-4">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="aspect-[3/2] relative flex items-center justify-center rounded-md overflow-hidden">
                      {isGenerating ? (
                        <p className="text-sm text-muted-foreground animate-pulse">
                          Generating illustration...
                        </p>
                      ) : showPreview ? (
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
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Select a style and click generate
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      className="w-full" 
                      variant="outline" 
                      disabled={!showPreview}
                    >
                      Download PNG
                    </Button>
                    <Button 
                      className="w-full" 
                      variant="outline" 
                      disabled={!showPreview}
                    >
                      Download SVG
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
} 