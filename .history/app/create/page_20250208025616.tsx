"use client"

import { useState } from "react"
import { Wand2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { StyleSelector } from "@/components/ui/style-selector"
import { styles, sizes } from "@/constants/styles"
import { fal } from "@fal-ai/client"
import Image from "next/image"
import { toast } from "sonner"

// Initialize fal client
fal.config({
  credentials: process.env.FAL_KEY,
})

export default function GeneratePage() {
  const [loading, setLoading] = useState(false)
  const [selectedStyle, setSelectedStyle] = useState<string>("")
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [prompt, setPrompt] = useState("")
  const [generatedImage, setGeneratedImage] = useState<string>("")

  const handleGenerate = async () => {
    if (!prompt || !selectedStyle || !selectedSize) {
      toast.error("Please fill in all fields")
      return
    }
    
    try {
      setLoading(true)
      
      const result = await fal.subscribe("fal-ai/recraft-v3", {
        input: {
          prompt,
          image_size: selectedSize === 'square' ? 'square_hd' : 
                     selectedSize === 'portrait' ? 'portrait_16_9' : 'landscape_16_9',
          style: "vector_illustration/line_art",
          colors: []
        },
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === "IN_PROGRESS") {
            update.logs.map((log) => log.message).forEach(console.log);
          }
        },
      });

      if (result.data.images?.[0]?.url) {
        setGeneratedImage(result.data.images[0].url);
        toast.success("Image generated successfully!");
      } else {
        throw new Error("No image generated");
      }

    } catch (error) {
      console.error('Generation error:', error);
      toast.error("Failed to generate image. Please try again.");
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="h-[calc(100vh-3.5rem)] w-full">
      <div className="max-w-full mx-auto px-4 md:px-6 lg:px-16 py-8">
        <div className="grid h-full grid-cols-1 lg:grid-cols-[2fr,3fr] gap-4">
          {/* Controls */}
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold">Generate AI Art</h1>
              <p className="text-muted-foreground">Describe your idea and let AI bring it to life</p>
            </div>

            <div className="space-y-4">
              {/* Prompt Input */}
              <div>
                <Label htmlFor="prompt">What would you like to create?</Label>
                <Textarea
                  id="prompt"
                  placeholder="A magical forest with glowing mushrooms and fairy lights..."
                  className="h-16"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>

              {/* Size Selection */}
              <div>
                <Label>Choose Size</Label>
                <div className="flex gap-2">
                  {sizes.map((size) => (
                    <Card
                      key={size.id}
                      className={cn(
                        "flex-1 p-3 cursor-pointer hover:bg-accent transition-colors",
                        selectedSize === size.id && "border-2 border-primary"
                      )}
                      onClick={() => setSelectedSize(size.id)}
                    >
                      <div className="font-medium">{size.label}</div>
                      <div className="text-xs text-muted-foreground">{size.description}</div>
                    </Card>
                  ))}
                </div>
              </div>

              <Button 
                disabled={loading || !prompt || !selectedSize}
                onClick={handleGenerate}
                className="w-full"
              >
                {loading ? "Generating..." : "Generate"}
                <Wand2 className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Preview */}
          <div className="flex flex-col h-full">
            <div className="flex justify-between mb-2">
              <h2 className="font-semibold">Preview</h2>
              {selectedSize && (
                <span className="text-muted-foreground">
                  {sizes.find(s => s.id === selectedSize)?.description}
                </span>
              )}
            </div>

            <Card className="flex-1 bg-dot-pattern relative overflow-hidden">
              {generatedImage ? (
                <Image
                  src={generatedImage}
                  alt={prompt}
                  fill
                  className="object-contain"
                  priority
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-b from-muted/50 to-muted/20">
                  <div className="relative h-full flex flex-col items-center justify-center text-center p-4">
                    <div className="rounded-full bg-primary/10 p-4 mb-4">
                      <Sparkles className="h-6 w-6 text-primary" />
                    </div>
                    <p className="font-medium">Ready to Generate</p>
                    <p className="text-sm text-muted-foreground">
                      Fill in the details to create your AI artwork
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
} 