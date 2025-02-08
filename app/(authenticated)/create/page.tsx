"use client"

import { useState } from "react"
import { Wand2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { StyleSelector } from "@/components/ui/style-selector"
import { styles, sizes } from "@/constants/styles"
import { fal } from "@fal-ai/client"
import Image from "next/image"
import { toast } from "sonner"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

// Initialize fal client with public key
fal.config({
  credentials: process.env.NEXT_PUBLIC_FAL_KEY,
})

type GenerationStatus = 'idle' | 'queued' | 'generating' | 'completed' | 'failed'

export default function GeneratePage() {
  const [status, setStatus] = useState<GenerationStatus>('idle')
  const [selectedStyle, setSelectedStyle] = useState<string>("")
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [prompt, setPrompt] = useState("")
  const [generatedImage, setGeneratedImage] = useState<string>("")
  const [queuePosition, setQueuePosition] = useState<number | null>(null)

  const handleGenerate = async () => {
    if (!prompt || !selectedSize) {
      toast.error("Please fill in all fields")
      return
    }
    
    try {
      setStatus('queued')
      setGeneratedImage("")
      
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, size: selectedSize })
      })

      if (!response.ok) {
        throw new Error('Generation failed')
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No response stream')

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = new TextDecoder().decode(value)
        const data = JSON.parse(chunk)

        if (data.status === 'IN_PROGRESS') {
          setStatus('generating')
          // Update queue position if available
          if (data.queuePosition) {
            setQueuePosition(data.queuePosition)
          }
        }

        if (data.data?.images?.[0]?.url) {
          setGeneratedImage(data.data.images[0].url)
          setStatus('completed')
          toast.success("Image generated successfully!")
          break
        }
      }

    } catch (error) {
      console.error('Generation error:', error)
      setStatus('failed')
      toast.error("Failed to generate image. Please try again.")
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
                disabled={status === 'generating' || status === 'queued'}
                onClick={handleGenerate}
                className="w-full"
              >
                {status === 'generating' || status === 'queued' ? (
                  <>
                    <LoadingSpinner className="mr-2 h-4 w-4" />
                    {status === 'queued' ? 'In Queue...' : 'Generating...'}
                  </>
                ) : (
                  <>
                    Generate
                    <Wand2 className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Preview */}
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-semibold">Preview</h2>
              <div className="flex items-center gap-2">
                {status !== 'idle' && (
                  <Badge variant={
                    status === 'completed' ? 'success' :
                    status === 'failed' ? 'destructive' :
                    'secondary'
                  }>
                    {status === 'queued' && queuePosition !== null && (
                      `Queue Position: ${queuePosition}`
                    )}
                    {status === 'generating' && 'Generating...'}
                    {status === 'completed' && 'Complete'}
                    {status === 'failed' && 'Failed'}
                  </Badge>
                )}
                {selectedSize && (
                  <span className="text-muted-foreground">
                    {sizes.find(s => s.id === selectedSize)?.description}
                  </span>
                )}
              </div>
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
                    {(status === 'generating' || status === 'queued') ? (
                      <>
                        <div className="rounded-full bg-primary/10 p-4 mb-4">
                          <LoadingSpinner className="h-6 w-6 text-primary" />
                        </div>
                        <p className="font-medium">
                          {status === 'queued' ? 'Waiting in Queue' : 'Creating Your Art'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {status === 'queued' 
                            ? 'Your request is in the queue...' 
                            : 'Almost there...'}
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="rounded-full bg-primary/10 p-4 mb-4">
                          <Sparkles className="h-6 w-6 text-primary" />
                        </div>
                        <p className="font-medium">Ready to Generate</p>
                        <p className="text-sm text-muted-foreground">
                          Fill in the details to create your AI artwork
                        </p>
                      </>
                    )}
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