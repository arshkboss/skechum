"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Download, Heart } from "lucide-react"
import { Card } from "./card"
import { Button } from "./button"
import { Badge } from "./badge"

interface ArtCardProps {
  imageUrl: string
  prompt: string
  style: string
  color?: boolean
  likes?: number
  onLike?: () => void
}

export function ArtCard({ 
  imageUrl, 
  prompt, 
  style, 
  color = true,
  likes = 0, 
  onLike 
}: ArtCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group"
    >
      <Card className="overflow-hidden">
        <div className="p-4 space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs font-medium">
              {style}
            </Badge>
            <Badge 
              variant="outline" 
              className="text-xs font-medium"
            >
              {color ? "Color" : "No Color"}
            </Badge>
          </div>

          {/* Prompt */}
          <p className="text-sm text-muted-foreground line-clamp-2 ">
            {prompt}
          </p>

          {/* Image */}
          <div className="relative aspect-square rounded-md overflow-hidden">
            <img
              src={imageUrl}
              alt={prompt}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
            
            {/* Hover Actions */}
            <div className="absolute bottom-0 left-0 right-0 p-2 flex justify-end items-center opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/60 to-transparent">
              <div className="flex gap-1">
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-8 w-8 text-white hover:text-white hover:bg-white/20"
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-8 w-8 text-white hover:text-white hover:bg-white/20"
                  onClick={onLike}
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
} 