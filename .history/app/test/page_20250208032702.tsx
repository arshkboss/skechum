"use client"

import { useState } from "react"
import { Wand2, Sparkles, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { toast } from "sonner"
import Image from "next/image"

// Define available models and their configurations
const models = [
  {
    id: "recraft-v3",
    name: "Recraft v3",
    styles: [
      { id: "line_art", name: "Line Art", style: "vector_illustration/line_art" },
      { id: "flat", name: "Flat Design", style: "vector_illustration/flat" },
      { id: "3d", name: "3D Style", style: "vector_illustration/3d" },
      { id: "pixel", name: "Pixel Art", style: "pixel_art" },
      { id: "realistic", name: "Realistic", style: "realistic_image" }
    ]
  },
  // Add other models here
] as const

const sizes = [
  {
    id: "square",
    label: "Square",
    description: "1:1 ratio (1024x1024)",
  },
  {
    id: "portrait",
    label: "Portrait",
    description: "9:16 ratio (576x1024)",
  },
  {
    id: "landscape",
    label: "Landscape",
    description: "16:9 ratio (1024x576)",
  },
]

type GenerationStatus = 'idle' | 'queued' | 'generating' | 'completed' | 'failed'

interface GeneratedImage {
  url: string
  prompt: string
  style: string
  model: string
  timestamp: number
}

export default function TestPage() {
  const [status, setStatus] = useState<GenerationStatus>('idle')
  const [selectedModel, setSelectedModel] = useState(models[0].id)
  const [selectedStyle, setSelectedStyle] = useState(models[0].styles[0].id)
  const [selectedSize, setSelectedSize] = useState<string>("square")
  const [prompt, setPrompt] = useState("")
  const [currentImage, setCurrentImage] = useState<string>("")
  const [history, setHistory] = useState<GeneratedImage[]>([])
  const [queuePosition, setQueuePosition] = useState<number | null>(null)

  const handleGenerate = async () => {
    if (!prompt || !selectedSize || !selectedStyle) {
      toast.error("Please fill in all fields")
      return
    }
    
    try {
      setStatus('queued')
      setCurrentImage("")
      
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt,
          size: selectedSize,
          style: models[0].styles.find(s => s.id === selectedStyle)?.style,
          model: selectedModel
        })
      })

      if (!response.ok) throw new Error('Generation failed')

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No response stream')

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = new TextDecoder().decode(value)
        const data = JSON.parse(chunk)

        if (data.status === 'IN_PROGRESS') {
          setStatus('generating')
          if (data.queuePosition) {
            setQueuePosition(data.queuePosition)
          }
        }

        if (data.data?.images?.[0]?.url) {
          const imageUrl = data.data.images[0].url
          setCurrentImage(imageUrl)
          setStatus('completed')
          
          // Add to history
          setHistory(prev => [{
            url: imageUrl,
            prompt,
            style: selectedStyle,
            model: selectedModel,
            timestamp: Date.now()
          }, ...prev])
          
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
    <div className="container mx-auto p-8">
      <Tabs defaultValue="generate" className="space-y-6">
        <TabsList>
          <TabsTrigger value="generate">Generate</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr,1fr] gap-6">
            {/* Controls */}
            <Card className="p-6 space-y-6">
              <div>
                <h2 className="text-xl font-bold">Test Generation</h2>
                <p className="text-muted-foreground">Experiment with different styles and settings</p>
              </div>

              <div className="space-y-4">
                {/* Model Selection */}
                <div>
                  <Label>Model</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {models.map((model) => (
                      <Card
                        key={model.id}
                        className={cn(
                          "p-3 cursor-pointer hover:bg-accent transition-colors",
                          selectedModel === model.id && "border-2 border-primary"
                        )}
                        onClick={() => setSelectedModel(model.id)}
                      >
                        <div className="font-medium">{model.name}</div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Style Selection */}
                <div>
                  <Label>Style</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {models[0].styles.map((style) => (
                      <Card
                        key={style.id}
                        className={cn(
                          "p-3 cursor-pointer hover:bg-accent transition-colors",
                          selectedStyle === style.id && "border-2 border-primary"
                        )}
                        onClick={() => setSelectedStyle(style.id)}
                      >
                        <div className="font-medium">{style.name}</div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Prompt Input */}
                <div>
                  <Label>Prompt</Label>
                  <Textarea
                    placeholder="Describe what you want to create..."
                    className="h-24 mt-2"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                </div>

                {/* Size Selection */}
                <div>
                  <Label>Size</Label>
                  <div className="flex gap-2 mt-2">
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
                      Generate Test
                      <Wand2 className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </Card>

            {/* Preview */}
            <Card className="p-6 space-y-4">
              <div className="flex justify-between items-center">
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
                </div>
              </div>

              <Card className="aspect-square relative overflow-hidden bg-dot-pattern">
                {currentImage ? (
                  <Image
                    src={currentImage}
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
                            {status === 'queued' ? 'Waiting in Queue' : 'Creating Test Image'}
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
                          <p className="font-medium">Ready to Test</p>
                          <p className="text-sm text-muted-foreground">
                            Configure settings and generate a test image
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Generation History</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {history.map((item, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="aspect-square relative">
                    <Image
                      src={item.url}
                      alt={item.prompt}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-3 space-y-1">
                    <p className="text-sm font-medium truncate">{item.prompt}</p>
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {item.style}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 