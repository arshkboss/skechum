"use client"

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface PromptInputProps {
  value: string
  onChange: (value: string) => void
}

export function PromptInput({ value, onChange }: PromptInputProps) {
  return (
    <div>
      <Label>Prompt</Label>
      <Textarea
        placeholder="Describe what you want to create..."
        className="h-24 mt-2"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
} 