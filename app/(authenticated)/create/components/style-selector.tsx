"use client"

import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { STYLE_OPTIONS, StyleOption } from "../types"

interface StyleSelectorProps {
  value: StyleOption
  onChange: (style: StyleOption) => void
}

export function StyleSelector({ value, onChange }: StyleSelectorProps) {
  return (
    <div>
      <Label>Style</Label>
      <div className="grid grid-cols-2 gap-2 mt-2">
        {STYLE_OPTIONS.map((style) => (
          <Card
            key={style.id}
            className={cn(
              "p-3 cursor-pointer hover:bg-accent transition-colors",
              value === style.id && "border-2 border-primary"
            )}
            onClick={() => onChange(style.id)}
          >
            <div className="font-medium">{style.label}</div>
            <div className="text-xs text-muted-foreground">{style.description}</div>
          </Card>
        ))}
      </div>
    </div>
  )
} 