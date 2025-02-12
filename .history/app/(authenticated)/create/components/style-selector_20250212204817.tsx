"use client"

import { STYLE_OPTIONS, STYLE_CREDIT_COSTS } from "../types"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface StyleSelectorProps {
  value: string
  onChange: (value: string) => void
}

export function StyleSelector({ value, onChange }: StyleSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-muted-foreground">
        Choose Style
      </label>
      <div className="grid grid-cols-3 sm:grid-cols-3 gap-2 sm:gap-3">
        {STYLE_OPTIONS.map((style) => (
          <Button
            key={style.id}
            variant="outline"
            className={cn(
              "group relative h-full p-0 overflow-hidden hover:border-primary/50",
              "flex flex-col items-stretch transition-all duration-200",
              value === style.id ? "border-2 border-primary bg-accent/50" : "border-border"
            )}
            onClick={() => onChange(style.id)}
          >
            <div className="relative w-full aspect-[3/2] overflow-hidden">
              <Image
                src={style.img}
                alt={style.name}
                fill
                className={cn(
                  "object-cover transition-transform duration-300",
                  "group-hover:scale-105"
                )}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
                priority
              />
            </div>
            <div className="flex flex-col p-2 sm:p-3 text-left bg-background/95 backdrop-blur-sm">
              <span className="font-medium text-xs sm:text-sm">
                {style.name}
              </span>
              <span className="text-[10px] sm:text-xs text-muted-foreground line-clamp-2 mt-0.5">
                {style.description}
              </span>
            </div>
          </Button>
        ))}
      </div>
    </div>
  )
} 