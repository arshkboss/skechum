"use client"

import { Card } from "@/components/ui/card"
import Image from "next/image"

export function HowItWorksSection() {
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
          {/* Step 1 */}
          <Card className="p-6 border border-muted relative">
            <span className="absolute -top-4 left-4 bg-primary text-primary-foreground text-sm font-medium px-3 py-1 rounded-full">
              1
            </span>
            <div className="aspect-square relative mb-4 bg-muted/50 rounded-lg overflow-hidden">
              <Image
                src="/images/how-it-works/step1.webp"
                alt="Enter a prompt to generate an illustration"
                fill
                className="object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Enter a prompt to generate an illustration
            </h3>
            <p className="text-muted-foreground">
              Describe what you want to create or upload a reference image to get started.
            </p>
          </Card>

          {/* Step 2 */}
          <Card className="p-6 border border-muted relative">
            <span className="absolute -top-4 left-4 bg-primary text-primary-foreground text-sm font-medium px-3 py-1 rounded-full">
              2
            </span>
            <div className="aspect-square relative mb-4 bg-muted/50 rounded-lg overflow-hidden">
              <Image
                src="/images/how-it-works/step2.webp"
                alt="Choose a style"
                fill
                className="object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Choose a style and click 'Generate'
            </h3>
            <p className="text-muted-foreground">
              Select from various artistic styles to match your vision perfectly.
            </p>
          </Card>

          {/* Step 3 */}
          <Card className="p-6 border border-muted relative">
            <span className="absolute -top-4 left-4 bg-primary text-primary-foreground text-sm font-medium px-3 py-1 rounded-full">
              3
            </span>
            <div className="aspect-square relative mb-4 bg-muted/50 rounded-lg overflow-hidden">
              <Image
                src="/images/how-it-works/step3.webp"
                alt="Get your illustration"
                fill
                className="object-cover"
              />
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