"use client"

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface Style {
  id: string
  name: string
  description: string
  image: string
  color: boolean
}

const styles: Style[] = [
  {
    id: "notion-style",
    name: "Notion Style",
    description: "Clean and modern illustrations in Notion's signature style",
    image: "/styles/notion-style.png",
    color: true
  },
  {
    id: "notion-minimal",
    name: "Notion Minimal",
    description: "Minimalist black & white Notion-style illustrations",
    image: "/styles/notion-minimal.png",
    color: false
  },
  {
    id: "line-art",
    name: "Line Art",
    description: "Elegant line drawings with clean strokes",
    image: "/styles/line-art.png",
    color: false
  },
  {
    id: "watercolor",
    name: "Watercolor",
    description: "Soft and dreamy watercolor illustrations",
    image: "/styles/watercolor.png",
    color: true
  }
]

interface StyleSelectorProps {
  selectedStyle?: string
  onSelectStyle?: (style: Style) => void
  className?: string
}

export function StyleSelector({ selectedStyle, onSelectStyle, className }: StyleSelectorProps) {
  return (
    <div className={cn(
      "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3",
      className
    )}>

      {styles.map((style) => (
        <Card 
          key={style.id}
          className={cn(
            "overflow-hidden cursor-pointer transition-all duration-200",
            "hover:shadow-md hover:bg-accent/50",
            selectedStyle === style.id && "ring-2 ring-primary",
            "max-w-[160px]"
          )}
          onClick={() => onSelectStyle?.(style)}
        >
          <div className="aspect-square relative bg-muted">
            <img 
              src={style.image} 
              alt={style.name}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="p-2">
            <h3 className="font-medium text-sm truncate">{style.name}</h3>
            <p className="text-xs text-muted-foreground">
              {style.color ? "Color" : "No Color"}
            </p>
          </div>
        </Card>
      ))}
    </div>
  )
} 