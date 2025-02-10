"use client"

import { useState, useRef, useEffect } from "react"
import { Wand2, Sparkles, DownloadCloud, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
import { fal } from "@fal-ai/client"

// Define types
interface GeneratedImage {
  url: string
  prompt: string
  timestamp: number
  generationTime?: number
}

type GenerationStatus = 'idle' | 'queued' | 'generating' | 'completed' | 'failed'

export default function CreatePage() {
  const { user } = useUser()
  const [status, setStatus] = useState<GenerationStatus>('idle')
  const [prompt, setPrompt] = useState("")
  const [currentImage, setCurrentImage] = useState<string>("")
  const [history, setHistory] = useState<GeneratedImage[]>([])
  const [isDownloading, setIsDownloading] = useState(false)
  const [imageLoading, setImageLoading] = useState(false)
  const [generationTime, setGenerationTime] = useState<number | null>(null)
  const [generationStartTime, setGenerationStartTime] = useState<number | null>(null)
  const [elapsedTime, setElapsedTime] = useState<number>(0)
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
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
      
      const result = await fal.subscribe("fal-ai/recraft-20b", {
        input: {
          prompt: prompt,
          image_size: "square_hd",
          style: "vector_illustration/doodle_line_art",
          colors: []
        },
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === "IN_PROGRESS") {
            console.log(update.logs.map((log) => log.message))
          }
        }
      })

      if (result.data?.images?.[0]?.url) {
        const imageUrl = result.data.images[0].url
        setCurrentImage(imageUrl)
      } else {
        throw new Error('No image generated')
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
        const { error } = await saveUserImage(
          currentImage,
          {
            prompt,
            settings: {
              model: 'recraft',
              size: 'square_hd',
              style: 'vector_illustration/doodle_line_art',
            },
            generationTime: finalTime,
            format: 'png',
            is_colored: true,
            keywords: prompt.toLowerCase().split(' ')
          },
          user.id
        )

        if (error) throw error

        setSavedImages(prev => new Set(prev).add(currentImage))
        setHistory(prev => [{
          url: currentImage,
          prompt,
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
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 50)
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
    timerIntervalRef.current = interval
  }

  const stopTimer = () => {
    if (timerIntervalRef.current !== null) {
      clearInterval(timerIntervalRef.current)
      timerIntervalRef.current = null
    }
  }

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current !== null) {
        clearInterval(timerIntervalRef.current)
      }
    }
  }, [])

  const isValidPrompt = (text: string) => text.trim().length >= 3

  return (
    <div className="container mx-auto p-8">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,1fr] gap-6">
        {/* Controls */}
        <Card className="p-6 space-y-6">
          <div>
            <h2 className="text-xl font-bold">Create with Recraft</h2>
            <p className="text-muted-foreground">AI-powered vector illustrations</p>
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

            <Button 
              disabled={
                status === 'generating' || 
                status === 'queued' || 
                imageLoading || 
                !isValidPrompt(prompt)
              }
              onClick={handleGenerate}
              className="w-full"
            >
              {status === 'generating' || status === 'queued' || imageLoading ? (
                <>
                  <LoadingSpinner className="mr-2 h-4 w-4" />
                  {status === 'queued' ? 'In Queue...' : 
                   imageLoading ? 'Loading Image...' : 'Generating...'}
                </>
              ) : !isValidPrompt(prompt) ? (
                <>
                  Enter at least 3 characters
                  <Wand2 className="ml-2 h-4 w-4 opacity-50" />
                </>
              ) : (
                <>
                  Generate Image
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
              <div className="absolute inset-0 bg-gradient-to-b from-muted/50 to-muted p-6">
                <div className="h-full flex flex-col items-center justify-center text-center border-2 border-dashed border-muted-foreground/25 rounded-lg">
                  {(status === 'generating' || status === 'queued') ? (
                    <>
                      <div className="rounded-full bg-primary/10 p-4 mb-4">
                        <LoadingSpinner className="h-6 w-6 text-primary" />
                      </div>
                      <p className="font-medium">
                        {status === 'queued' ? 'Waiting in Queue' : 'Creating Your Image'}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {status === 'queued' 
                          ? 'Your request is being processed...' 
                          : 'This might take a few seconds...'}
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="rounded-full bg-primary/10 p-4 mb-4">
                        <Sparkles className="h-6 w-6 text-primary" />
                      </div>
                      <p className="font-medium">Preview Area</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Your generated image will appear here
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}
          </Card>

          {/* Download Button */}
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
                      <DownloadCloud className="mr-2 h-4 w-4" />
                      Download As
                      <ChevronDown className="ml-2 h-4 w-4 opacity-70" />
                    </>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px]">
                <DropdownMenuItem onClick={() => handleDownload('png')}>
                  PNG Image
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDownload('jpg')}>
                  JPG Image
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDownload('svg')}>
                  SVG Vector
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </Card>
      </div>

      {/* History Section */}
      {history.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Recent Generations</h2>
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
                <div className="p-3">
                  <p className="text-sm font-medium truncate">{item.prompt}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 