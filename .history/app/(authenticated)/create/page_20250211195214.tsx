"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"
import { useUser } from "@/hooks/use-user"
import { saveUserImage } from "@/services/images"
import { PromptInput } from "./components/prompt-input"
import { GenerateButton } from "./components/generate-button"
import { ImagePreview } from "./components/image-preview"
import { DownloadButton } from "./components/download-button"
import { HistorySection } from "./components/history-section"
import { GenerationStatus, GeneratedImage, StyleOption, STYLE_OPTIONS } from "./types"
import { StyleSelector } from "./components/style-selector"
import { detectImageFormat, convertImage } from '@/utils/image-utils'
import { useRouter } from "next/navigation"

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
  const [selectedStyle, setSelectedStyle] = useState<StyleOption>(STYLE_OPTIONS[0].id)
  const [originalFormat, setOriginalFormat] = useState<'PNG' | 'SVG' | 'JPG'>('PNG')
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleGenerate = async () => {
    if (!prompt || isProcessing) {
      return
    }
    
    try {
      setIsProcessing(true)
      
      // First attempt to deduct credits
      const deductResponse = await fetch('/api/credits/deduct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ style: selectedStyle })
      })

      if (!deductResponse.ok) {
        const error = await deductResponse.json()
        if (error.error === 'Insufficient credits') {
          toast.error("You don't have enough credits. Please purchase more.")
          router.push('/pricing')
          return
        }
        throw new Error(error.error || 'Failed to process credits')
      }

      // Get the updated credits and dispatch event
      const creditData = await deductResponse.json()
      if (creditData.success && typeof creditData.remainingCredits === 'number') {
        window.dispatchEvent(
          new CustomEvent('creditsUpdated', { 
            detail: { credits: creditData.remainingCredits }
          })
        )
      }

      // Continue with existing generation logic
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
          prompt,
          style: selectedStyle
        })
      })

      if (!response.ok) {
        if (response.status === 504) {
          // Handle timeout specifically
          toast.error("Generation is taking longer than expected. Please try again.")
          
          // Optionally, implement credit refund for timeout
          try {
            await fetch('/api/credits/refund', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                style: selectedStyle,
                reason: 'timeout'
              })
            })
          } catch (refundError) {
            console.error('Failed to refund credits:', refundError)
          }
          
          return
        }
        throw new Error('Generation failed')
      }

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
    } finally {
      setIsProcessing(false)
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
        const imageFormat = await detectImageFormat(currentImage)
        setOriginalFormat(imageFormat.toUpperCase() as 'PNG' | 'SVG' | 'JPG')
        
        const { error } = await saveUserImage(
          currentImage,
          {
            prompt,
            settings: {
              model: 'recraft',
              size: 'square_hd',
              style: selectedStyle,
            },
            generationTime: finalTime,
            format: imageFormat.toUpperCase() as 'PNG' | 'SVG' | 'JPG',
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
          generationTime: finalTime,
          format: imageFormat // Add format to history
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

  const handleDownload = async (format: 'PNG' | 'JPG' | 'SVG') => {
    if (!currentImage || !prompt) return

    try {
      setIsDownloading(true)
      const blob = await convertImage(currentImage, originalFormat, format)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${formatFileName(prompt)}.${format.toLowerCase()}`
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
        <Card className="p-6 space-y-6">
          <div>
            <h2 className="text-xl font-bold">Create with Skechum</h2>
            <p className="text-muted-foreground">AI-powered vector illustrations</p>
          </div>

          <div className="space-y-4">
            <PromptInput 
              value={prompt}
              onChange={setPrompt}
            />
            <StyleSelector
              value={selectedStyle}
              onChange={setSelectedStyle}
            />
            <GenerateButton
              status={status}
              isLoading={imageLoading || isProcessing}
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
<div className="flex justify-end mt-4">
      <DownloadButton
        currentImage={currentImage}
        isDownloading={isDownloading}
        imageLoading={imageLoading}
        originalFormat={originalFormat}
        onDownload={handleDownload}
      /></div>

      <HistorySection history={history} />
    </div>
  )
} 