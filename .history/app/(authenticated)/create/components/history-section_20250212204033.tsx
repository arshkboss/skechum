"use client"

import { Card } from "@/components/ui/card"
import Image from "next/image"
import { GeneratedImage } from "../types"

interface HistorySectionProps {
  history: GeneratedImage[]
}

export function HistorySection({ history }: HistorySectionProps) {
  if (history.length === 0) return null

  return (
    <div>
      <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Recent Generations</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {history.map((item, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="aspect-square relative">
              <Image
                src={item.url}
                alt={item.prompt}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-2 sm:p-3">
              <p className="text-xs sm:text-sm font-medium truncate">
                {item.prompt}
              </p>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
                {new Date(item.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
} 