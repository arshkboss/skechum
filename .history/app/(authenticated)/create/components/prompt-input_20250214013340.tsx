"use client"

import { useState } from 'react'
import { generateImage } from '@/app/actions/generate-image'
import type { GenerationResponse } from '@/app/actions/generate-image'
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface PromptInputProps {
  value: string
  onChange: (value: string) => void
  onGenerate?: () => void
}

export function PromptInput({ value, onChange, onGenerate }: PromptInputProps) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<GenerationResponse | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Prompt</Label>
      <Textarea
        placeholder="Describe what you want to create..."
        className="h-20 resize-none"
        value={value}
        onChange={handleChange}
      />
    </div>
  )
} 