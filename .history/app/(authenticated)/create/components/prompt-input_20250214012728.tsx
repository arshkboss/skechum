"use client"

import { useState } from 'react'
import { generateImage } from '@/app/actions/generate-image'
import type { GenerationResponse } from '@/app/actions/generate-image'
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function PromptInput() {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<GenerationResponse | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await generateImage(prompt)
      setResult(response)
    } catch (error) {
      console.error('Error generating image:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label className="text-sm font-medium">Prompt</Label>
          <Textarea
            placeholder="Describe what you want to create..."
            className="h-20 resize-none"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Generate'}
        </button>
      </form>

      {result?.error && (
        <div className="text-red-500">{result.error}</div>
      )}

      {result?.images?.map((image, index) => (
        <img 
          key={index}
          src={image.url}
          alt={`Generated image ${index + 1}`}
          className="w-full rounded-lg shadow-md"
        />
      ))}
    </div>
  )
} 