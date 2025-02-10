"use client"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"
import { useUser } from "@/hooks/use-user"
import { saveUserImage } from "@/services/images"
import { PromptInput } from "./components/prompt-input"
import { GenerateButton } from "./components/generate-button"
import { ImagePreview } from "./components/image-preview"
import { DownloadButton } from "./components/download-button"
import { HistorySection } from "./components/history-section"
import { GenerationStatus, GeneratedImage } from "./types"

// Define types
interface FalImage {
  url: string
  // Add other image properties if needed
}

interface FalResponse {
  data?: {
    images?: FalImage[]
  }
  // Add other response properties if needed
}

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
      
      const response = await fetch('/api/test-recraft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt
        })
      })

      if (!response.ok) throw new Error('Generation failed')

      const result = await response.json()

      if (result.data?.images?.[0]?.url) {
        const imageUrl = result.data.images[0].url
        setCurrentImage(imageUrl)
        // Don't set generation time here, wait for image load
      } else {
        throw new Error('No image generated')
      }

    } catch (error) {
      console.error('Generation error:', error)
      setStatus('failed')
      setImageLoading(false)
      stopTimer()
      toast.error(error instanceof Error ? error.message : "Failed to generate image. Please try again.")
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
        <Card className="p-6 space-y-6">
          <div>
            <h2 className="text-xl font-bold">Create with Recraft</h2>
            <p className="text-muted-foreground">AI-powered vector illustrations</p>
          </div>

          <div className="space-y-4">
            <PromptInput 
              value={prompt}
              onChange={setPrompt}
            />
            <GenerateButton
              status={status}
              isLoading={imageLoading}
              isValid={isValidPrompt(prompt)}
              onClick={handleGenerate}
            />
          </div>
        </Card>

        <ImagePreview
          status={status}
          currentImage={currentImage}
          prompt={prompt}
          imageLoading={imageLoading}
          elapsedTime={elapsedTime}
          generationTime={generationTime}
          onImageLoad={handleImageLoad}
          formatTime={formatTime}
        />
      </div>

      <DownloadButton
        currentImage={currentImage}
        isDownloading={isDownloading}
        imageLoading={imageLoading}
        onDownload={handleDownload}
      />

      <HistorySection history={history} />
    </div>
  )
} 