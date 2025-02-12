"use client"

import { STYLE_OPTIONS } from "../types"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Image from "next/image"

interface StyleSelectorProps {
  value: string
  onChange: (value: string) => void
}

export function StyleSelector({ value, onChange }: StyleSelectorProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a style">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-md overflow-hidden border">
              <Image
                src={`/styles/${value}.png`}
                alt={STYLE_OPTIONS.find(style => style.id === value)?.name || "Style preview"}
                fill
                className="object-cover"
                sizes="40px"
              />
            </div>
            <span className="font-medium">
              {STYLE_OPTIONS.find(style => style.id === value)?.name || "Select style"}
            </span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {STYLE_OPTIONS.map((style) => (
          <SelectItem key={style.id} value={style.id}>
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-md overflow-hidden border">
                <Image
                  src={`/styles/${style.id}.png`}
                  alt={style.name}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-medium">{style.name}</span>
                <span className="text-sm text-muted-foreground">{style.description}</span>
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
} 