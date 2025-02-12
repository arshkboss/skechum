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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {STYLE_OPTIONS.map((style) => (
        <Button
          key={style.id}
          variant="outline"
          className={cn(
            "h-auto p-4 flex flex-col gap-3 hover:bg-accent transition-all",
            value === style.id && "border-2 border-primary bg-accent"
          )}
          onClick={() => onChange(style.id)}
        >
          <div className="flex ">
            <div className="relative w-full aspect-square rounded-md overflow-hidden border flex items-center justify-center">
              <Image
                src={style.img}
                alt={style.name || "Style preview"}
                fill
                className="object-cover"
              sizes="(max-width: 768px) 50vw, 25vw"
              priority
            />
            </div>
            <div className="flex flex-col gap-1 text-left">
            <span className="font-medium">{style.name}</span>
            <span className="text-xs text-muted-foreground line-clamp-2">{style.description}</span>
            </div>
          </div>
        </Button>
      ))}
    </div>
  )
} 