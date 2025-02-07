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
import type { RecraftV3Input } from "@fal-ai/client/dist/services/recraft-v3"
import Image from "next/image"
import { toast } from "sonner"

// Initialize fal client
fal.config({
  credentials: process.env.NEXT_PUBLIC_FAL_KEY,
})

// Define the image size type using RecraftV3Input
type ImageSize = RecraftV3Input['image_size']
type RecraftStyle = RecraftV3Input['style']

export default function GeneratePage() {
  const [loading, setLoading] = useState(false)
  const [selectedStyle, setSelectedStyle] = useState<string>("")
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [prompt, setPrompt] = useState("")
  const [color, setColor] = useState(true)
  const [generatedImage, setGeneratedImage] = useState<string>("")

  // Add detailed logging for state changes
  const logStateChange = (name: string, value: any) => {
    console.log(`[State Change] ${name}:`, value)
  }

  const handleGenerate = async () => {
    if (!prompt || !selectedStyle || !selectedSize) {
      console.log('[Validation Failed]', { prompt, selectedStyle, selectedSize })
      return
    }
    
    try {
      console.log('[Generation Started]', {
        prompt,
        style: selectedStyle,
        size: selectedSize,
        color
      })
      
      setLoading(true)
      
      const sizeMap: Record<string, ImageSize> = {
        'square': 'square_hd',
        'portrait': 'portrait_16_9',
        'landscape': 'landscape_16_9'
      }

      const selectedImageSize = sizeMap[selectedSize] || 'square_hd'
      
      // Log the full request for debugging
      const requestPayload = {
        input: {
          prompt,
          image_size: selectedImageSize,
          style: "vector_illustration/line_art" as RecraftStyle,
          colors: []
        },
        logs: true
      }
      console.log('[Full Request Payload]', requestPayload)

      const result = await fal.subscribe("fal-ai/recraft-v3", requestPayload);

      console.log('[Raw API Response]', result)

      if (!result?.data?.images?.[0]?.url) {
        throw new Error("Invalid response format from API")
      }

      const imageUrl = result.data.images[0].url
      console.log('[Generated Image URL]', imageUrl)
      setGeneratedImage(imageUrl)
      toast.success("Image generated successfully!")

    } catch (error: any) {
      console.error('[Generation Error Details]', {
        message: error.message,
        stack: error.stack,
        details: error.details || 'No additional details'
      })
      
      // More specific error message based on the error
      const errorMessage = error.message?.includes('credentials')
        ? "API key configuration error. Please check your settings."
        : "Failed to generate image. Please try again."
      
      toast.error(errorMessage)
    } finally {
      setLoading(false)
      console.log('[Generation Complete]')
    }
  }

  // Add logging to state changes
  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newPrompt = e.target.value
    setPrompt(newPrompt)
    logStateChange('prompt', newPrompt)
  }

  const handleStyleSelect = (style: any) => {
    setSelectedStyle(style.id)
    setColor(style.color)
    logStateChange('style', style)
  }

  const handleSizeSelect = (sizeId: string) => {
    setSelectedSize(sizeId)
    logStateChange('size', sizeId)
  }

  return (
    <main className="h-[calc(100vh-3.5rem)] w-full">
      <div className="max-w-full mx-auto px-4 md:px-6 lg:px-16 py-8 ">
        <div className="grid h-full grid-cols-1 lg:grid-cols-[2fr,3fr] gap-4">
          {/* Controls - 40% */}
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
                  onChange={handlePromptChange}
                />
              </div>

              {/* Style Selection */}
              <div>
                <Label>Choose Style</Label>
                <StyleSelector 
                  selectedStyle={selectedStyle}
                  onSelectStyle={handleStyleSelect}
                  className="mt-2"
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
                      onClick={() => handleSizeSelect(size.id)}
                    >
                      <div className="font-medium">{size.label}</div>
                      <div className="text-xs text-muted-foreground">{size.description}</div>
                    </Card>
                  ))}
                </div>
              </div>

              <Button 
                id="generate-button"
                disabled={loading || !prompt || !selectedStyle || !selectedSize}
                onClick={handleGenerate}
                className="w-full"
              >
                {loading ? "Generating..." : "Generate"}
                <Wand2 className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Preview - Updated to show generated image */}
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

            {selectedStyle && (
              <Card className="p-2 mt-2 bg-muted/50 inline-flex items-center gap-2 self-start">
                <span className="text-lg">{styles.find(s => s.id === selectedStyle)?.icon}</span>
                <span>{styles.find(s => s.id === selectedStyle)?.label}</span>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  )
} 