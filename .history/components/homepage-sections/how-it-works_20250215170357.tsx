"use client"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wallet } from "lucide-react"
import Image from "next/image"

export function HowItWorksSection() {
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
      img: "/styles/line_art.png"
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
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How Illustration Generator works
          </h2>
          <p className="text-lg text-muted-foreground">
            Three easy steps to transform your ideas into professional illustrations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {/* Step 1: Prompt Input */}
          <Card className="p-6 border border-muted relative">
            <span className="absolute -top-4 left-4 bg-primary text-primary-foreground text-sm font-medium px-3 py-1 rounded-full">
              1
            </span>
            <div className="h-[300px] mb-4 flex flex-col gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="space-y-2">
                <label className="text-sm font-medium">Enter your prompt</label>
                <Input 
                  placeholder="group of people dancing"
                  className="w-full"
                />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Enter a prompt to generate an illustration
            </h3>
            <p className="text-muted-foreground">
              Describe what you want to create in a few words
            </p>
          </Card>

          {/* Step 2: Style Selector */}
          <Card className="p-6 border border-muted relative">
            <span className="absolute -top-4 left-4 bg-primary text-primary-foreground text-sm font-medium px-3 py-1 rounded-full">
              2
            </span>
            <div className="h-[300px] mb-4 flex flex-col gap-3 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
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
                    className="h-auto p-1 flex flex-col items-stretch"
                  >
                    <div className="relative w-full aspect-[3/2] mb-1">
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
            <h3 className="text-xl font-semibold mb-2">
              Choose a style and click 'Generate'
            </h3>
            <p className="text-muted-foreground">
              Select from various artistic styles to match your vision perfectly.
            </p>
          </Card>

          {/* Step 3: Result */}
          <Card className="p-6 border border-muted relative">
            <span className="absolute -top-4 left-4 bg-primary text-primary-foreground text-sm font-medium px-3 py-1 rounded-full">
              3
            </span>
            <div className="h-[300px] mb-4 flex flex-col gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="relative flex-1 bg-white rounded-lg overflow-hidden">
                <Image
                  src="/illustrations/dancing-group.png"
                  alt="Generated illustration"
                  fill
                  className="object-contain p-4"
                />
              </div>
              <div className="flex gap-2">
                <Button className="w-full" variant="outline">Download PNG</Button>
                <Button className="w-full" variant="outline">Download SVG</Button>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Get a high-quality illustration
            </h3>
            <p className="text-muted-foreground">
              Download your professionally generated illustration in multiple formats.
            </p>
          </Card>
        </div>
      </div>
    </section>
  )
} 