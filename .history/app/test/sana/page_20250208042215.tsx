"use client"

import { useState } from "react"
import { Wand2, Sparkles, DownloadCloud, ChevronDown } from "lucide-react"
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
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useUser } from "@/hooks/use-user"
import { saveUserImage } from "@/services/images"

const SANA_CONFIG = {
  sizes: [
    { id: "square", label: "Square", description: "1024x1024" },
    { id: "portrait", label: "Portrait", description: "576x1024" },
    { id: "landscape", label: "Landscape", description: "1024x576" }
  ],
  inference_steps: [18, 25, 30, 50],
  guidance_scales: [5, 7, 8, 10]
} as const

interface GeneratedImage {
  url: string
  prompt: string
  settings: SanaSettings
  timestamp: number
  generationTime?: number
}

interface SanaSettings {
  size: string
  steps: number
  guidance: number
  negative_prompt?: string
}

type GenerationStatus = 'idle' | 'queued' | 'generating' | 'completed' | 'failed'

export default function SanaTestPage() {
  const { user } = useUser()
  const [status, setStatus] = useState<GenerationStatus>('idle')
  const [prompt, setPrompt] = useState("")
  const [currentImage, setCurrentImage] = useState<string>("")
  const [history, setHistory] = useState<GeneratedImage[]>([])
  const [settings, setSettings] = useState<SanaSettings>({
    size: "square",
    steps: 18,
    guidance: 7,
    negative_prompt: ""
  })
  const [isDownloading, setIsDownloading] = useState(false)
  const [imageLoading, setImageLoading] = useState(false)
  const [generationTime, setGenerationTime] = useState<number | null>(null)
  const [generationStartTime, setGenerationStartTime] = useState<number | null>(null)
  const [elapsedTime, setElapsedTime] = useState<number>(0)
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timer | null>(null)
  const [savedImages, setSavedImages] = useState<Set<string>>(new Set())

  const handleGenerate = async () => {
    if (!prompt) {
      toast.error("Please enter a prompt")
      return
    }
    
    try {
      setStatus('queued')
      setCurrentImage("")
      setGenerationTime(null)
      setGenerationStartTime(Date.now())
      setImageLoading(true)
      setElapsedTime(0)
      startTimer()
      setSavedImages(new Set())
      
      const response = await fetch('/api/test-sana', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          size: settings.size,
          num_inference_steps: settings.steps,
          guidance_scale: settings.guidance,
          negative_prompt: settings.negative_prompt
        })
      })

      if (!response.ok) throw new Error('Generation failed')

      const result = await response.json()

      if (result.data?.images?.[0]?.url) {
        const imageUrl = result.data.images[0].url
        setCurrentImage(imageUrl)
        // Don't set generation time here, wait for image load
      }

    } catch (error) {
      console.error('Generation error:', error)
      setStatus('failed')
      setImageLoading(false)
      stopTimer()
      toast.error("Failed to generate image. Please try again.")
    }
  }

  const handleImageLoad = async () => {
    const endTime = Date.now()
    const finalTime = endTime - (generationStartTime || endTime)
    
    setGenerationTime(finalTime)
    setImageLoading(false)
    setStatus('completed')
    stopTimer()
    
    if (currentImage && user?.id && !savedImages.has(currentImage)) {
      try {
        // Save to storage and database
        const { error } = await saveUserImage(
          currentImage,
          {
            prompt,
            settings: {
              model: 'sana',
              size: settings.size,
              steps: settings.steps,
              guidance: settings.guidance,
              negative_prompt: settings.negative_prompt
            },
            generationTime: finalTime,
            format: 'png',
            is_colored: true,
            keywords: prompt.toLowerCase().split(' ')
          },
          user.id
        )

        if (error) throw error

        // Mark this image as saved
        setSavedImages(prev => new Set(prev).add(currentImage))

        // Update local history
        setHistory(prev => [{
          url: currentImage,
          prompt,
          settings: { ...settings },
          timestamp: endTime,
          generationTime: finalTime
        }, ...prev])
        
        toast.success("Image generated and saved successfully!")
      } catch (error) {
        console.error('Error saving image:', error)
        toast.error("Image generated but failed to save")
      }
    }
  }

  const formatFileName = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') // Replace any non-alphanumeric chars with -
      .replace(/-+/g, '-')         // Replace multiple - with single -
      .replace(/^-|-$/g, '')       // Remove - from start and end
      .slice(0, 50)                // Limit length
  }

  const handleDownload = async (format: 'png' | 'jpg' | 'svg') => {
    if (!currentImage || !prompt) return

    try {
      setIsDownloading(true)
      const response = await fetch(currentImage)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${formatFileName(prompt)}.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success("Image downloaded successfully")
    } catch (error) {
      console.error('Download error:', error)
      toast.error("Failed to download image")
    } finally {
      setIsDownloading(false)
    }
  }

  const formatTime = (ms: number) => {
    const seconds = (ms / 1000).toFixed(1)
    return `${seconds}s`
  }

  const startTimer = () => {
    const startTime = Date.now()
    const interval = setInterval(() => {
      setElapsedTime(Date.now() - startTime)
    }, 100)
    setTimerInterval(interval)
  }

  const stopTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval)
      setTimerInterval(null)
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
                <h2 className="text-xl font-bold">SANA Model Testing</h2>
                <p className="text-muted-foreground">Cost-effective model ($0.001/image)</p>
              </div>

              <div className="space-y-4">
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
                    {SANA_CONFIG.sizes.map((size) => (
                      <Card
                        key={size.id}
                        className={cn(
                          "flex-1 p-3 cursor-pointer hover:bg-accent transition-colors",
                          settings.size === size.id && "border-2 border-primary"
                        )}
                        onClick={() => setSettings(prev => ({ ...prev, size: size.id }))}
                      >
                        <div className="font-medium">{size.label}</div>
                        <div className="text-xs text-muted-foreground">{size.description}</div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Advanced Settings */}
                <div className="space-y-4">
                  <div>
                    <Label>Inference Steps</Label>
                    <select 
                      className="w-full mt-2 p-2 border rounded-md"
                      value={settings.steps}
                      onChange={(e) => setSettings(prev => ({ 
                        ...prev, 
                        steps: Number(e.target.value) 
                      }))}
                    >
                      {SANA_CONFIG.inference_steps.map(steps => (
                        <option key={steps} value={steps}>{steps} steps</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label>Guidance Scale</Label>
                    <select 
                      className="w-full mt-2 p-2 border rounded-md"
                      value={settings.guidance}
                      onChange={(e) => setSettings(prev => ({ 
                        ...prev, 
                        guidance: Number(e.target.value) 
                      }))}
                    >
                      {SANA_CONFIG.guidance_scales.map(scale => (
                        <option key={scale} value={scale}>{scale}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label>Negative Prompt (Optional)</Label>
                    <Textarea
                      placeholder="What to avoid in the generation..."
                      className="mt-2"
                      value={settings.negative_prompt}
                      onChange={(e) => setSettings(prev => ({ 
                        ...prev, 
                        negative_prompt: e.target.value 
                      }))}
                    />
                  </div>
                </div>

                <Button 
                  disabled={status === 'generating' || status === 'queued' || imageLoading}
                  onClick={handleGenerate}
                  className="w-full"
                >
                  {status === 'generating' || status === 'queued' || imageLoading ? (
                    <>
                      <LoadingSpinner className="mr-2 h-4 w-4" />
                      {status === 'queued' ? 'In Queue...' : 
                       imageLoading ? 'Loading Image...' : 'Generating...'}
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
                      {status === 'queued' && 'In Queue'}
                      {status === 'generating' && 'Generating...'}
                      {status === 'completed' && 'Complete'}
                      {status === 'failed' && 'Failed'}
                    </Badge>
                  )}
                  {(status === 'queued' || status === 'generating' || imageLoading) ? (
                    <Badge variant="outline" className="font-mono">
                      Elapsed: {formatTime(elapsedTime)}
                    </Badge>
                  ) : generationTime && status === 'completed' ? (
                    <Badge variant="outline" className="font-mono">
                      Generated in {formatTime(generationTime)}
                    </Badge>
                  ) : null}
                </div>
              </div>

              <Card className="aspect-square relative overflow-hidden bg-dot-pattern">
                {currentImage ? (
                  <>
                    <Image
                      src={currentImage}
                      alt={prompt}
                      fill
                      className={cn(
                        "object-contain transition-opacity duration-300",
                        imageLoading ? "opacity-0" : "opacity-100"
                      )}
                      priority
                      onLoad={handleImageLoad}
                    />
                    {imageLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                        <div className="text-center">
                          <LoadingSpinner className="h-8 w-8 mb-2" />
                          <p className="text-sm text-muted-foreground">Loading image...</p>
                        </div>
                      </div>
                    )}
                  </>
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

              {/* Download Button - disabled while image is loading */}
              <div className="flex justify-end mt-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      disabled={!currentImage || isDownloading || imageLoading}
                      className={cn(
                        "w-[180px] transition-all duration-200",
                        (isDownloading || imageLoading) && "opacity-80"
                      )}
                    >
                      {isDownloading ? (
                        <>
                          <LoadingSpinner className="mr-2 h-4 w-4" />
                          Downloading...
                        </>
                      ) : (
                        <>
                          <DownloadCloud className={cn(
                            "mr-2 h-4 w-4 transition-transform duration-200",
                            "group-hover:-translate-y-0.5"
                          )} />
                          Download As
                          <ChevronDown className="ml-2 h-4 w-4 opacity-70" />
                        </>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-[180px] animate-in fade-in-0 zoom-in-95"
                  >
                    <DropdownMenuItem
                      onClick={() => handleDownload('png')}
                      className="flex items-center cursor-pointer hover:bg-accent"
                    >
                      <span className="font-medium">PNG Image</span>
                      <span className="ml-auto text-xs text-muted-foreground">
                        Recommended
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      disabled
                      className="flex items-center text-muted-foreground"
                    >
                      <span>JPG Image</span>
                      <span className="ml-auto text-xs">Coming Soon</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      disabled
                      className="flex items-center text-muted-foreground"
                    >
                      <span>SVG Vector</span>
                      <span className="ml-auto text-xs">Coming Soon</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Test History</h2>
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
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="secondary" className="text-xs">
                        {item.settings.steps} steps
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {item.settings.size}
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