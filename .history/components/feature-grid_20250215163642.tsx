"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
    name: "Doodle Style",
    description: "Clean and modern illustrations in clean doodle style",
    image: "/styles/color_doodle.png",
    color: true
  },
  {
    id: "notion-minimal",
    name: "Notion Minimal",
    description: "Minimalist black & white Notion-style illustrations",
    image: "/styles/notion-minimal.png",
    color: false
  },/*
  {
    id: "line-art",
    name: "Line Art",
    description: "Elegant line drawings with clean strokes",
    image: "/styles/line-art.png",
    color: false
  },*/
  {
    id: "watercolor",
    name: "Watercolor",
    description: "Soft and dreamy watercolor illustrations",
    image: "/styles/watercolor.png",
    color: true
  }/*,
  {
    id: "flat-design",
    name: "Flat Design",
    description: "Modern flat illustrations with bold colors",
    image: "/styles/flat-design.png",
    color: true
  },
  {
    id: "sketch",
    name: "Sketch",
    description: "Hand-drawn sketch style illustrations",
    image: "/styles/sketch.png",
    color: true
  }*/
]


interface FeatureGridProps {
  className?: string
}

export function FeatureGrid({ className }: FeatureGridProps) {
  return (
    <div className={cn(
      "max-w-6xl mx-auto",
      "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 justify-center",
      className
    )}>
      {styles.map((style) => (
        <Card 
          key={style.id}
          className="group cursor-pointer overflow-hidden transition-colors hover:bg-accent"
        >
          <div className="aspect-[16/10] relative overflow-hidden">
            <img 
              src={style.image} 
              alt={style.name}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute top-2 right-2 flex gap-2">
              <Badge variant="secondary" className="text-xs">
                {style.name}
              </Badge>
              <Badge 
                variant="outline" 
                className="text-xs bg-background/50 backdrop-blur-sm"
              >
                {style.color ? "Color" : "No Color"}
              </Badge>
            </div>
          </div>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-2">{style.name}</h3>
            <p className="text-sm text-muted-foreground">{style.description}</p>
          </div>
        </Card>
      ))}
    </div>
  )
} 