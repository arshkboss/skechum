"use client"

import { useState } from 'react'
import { generateImage } from '@/app/actions/generate-image'
import type { GenerationResponse } from '@/app/actions/generate-image'

export default function PromptInput() {
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
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt..."
          className="input"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Generate'}
        </button>
      </form>

      {result?.error && (
        <div className="error">{result.error}</div>
      )}

      {result?.images?.map((image, index) => (
        <img 
          key={index}
          src={image.url}
          alt={`Generated image ${index + 1}`}
          className="generated-image"
        />
      ))}
    </div>
  )
} 