"use client"

import { STYLE_OPTIONS } from "../types"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface StyleSelectorProps {
  value: string
  onChange: (value: string) => void
}

export function StyleSelector({ value, onChange }: StyleSelectorProps) {
  return (
    <div className="space-y-4">
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        Choose Style
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {STYLE_OPTIONS.map((style) => (
          <Button
            key={style.id}
            variant="outline"
            className={cn(
              "group relative h-auto p-0 overflow-hidden transition-all duration-200 hover:border-primary/50",
              value === style.id && "border-2 border-primary ring-2 ring-primary/20"
            )}
            onClick={() => onChange(style.id)}
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-sm">
              <Image
                src={style.img}
                alt={style.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority
              />
            </div>
            <div className="flex flex-col gap-1.5 p-4 text-left">
              <span className="font-semibold tracking-tight">
                {style.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {style.description}
              </span>
            </div>
          </Button>
        ))}
      </div>
    </div>
  )
} 