"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { ImageOff } from "lucide-react"
import { toast } from "sonner"

export default function CreateQueueTest() {
  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [requestId, setRequestId] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    
    setLoading(true)
    setError(null)
    setImageUrl(null)
    
    try {
      const response = await fetch("/api/test-queue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate image")
      }

      if (!data.data?.image_url) {
        throw new Error("No image URL in response")
      }

      setImageUrl(data.data.image_url)
      setRequestId(data.data.request_id)
      
    } catch (err) {
      console.error("Generation error:", err)
      const errorMessage = err instanceof Error ? err.message : "Something went wrong"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-8 max-w-2xl space-y-8">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Queue Test - Image Generation</h1>
        <p className="text-muted-foreground">
          Test the new queue-based image generation system
        </p>
      </div>

      <div className="flex gap-4">
        <Input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt..."
          disabled={loading}
        />
        <Button 
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
        >
          {loading ? "Generating..." : "Generate"}
        </Button>
      </div>

      {error && (
        <div className="text-red-500 text-sm">
          {error}
        </div>
      )}

      {(imageUrl || loading) && (
        <Card className="overflow-hidden">
          <div className="aspect-square relative bg-muted">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-pulse text-muted-foreground">
                  Generating...
                </div>
              </div>
            ) : imageUrl ? (
              <Image
                src={imageUrl}
                alt={prompt}
                fill
                className="object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  e.currentTarget.parentElement?.querySelector('.fallback')?.classList.remove('hidden')
                }}
              />
            ) : null}
            <div className="fallback hidden absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <ImageOff className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Image failed to load</p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
} 