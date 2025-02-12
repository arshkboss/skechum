"use client"

import { memo } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { StorageImage } from "@/app/types/image"
import { ImageOff } from "lucide-react"
import Link from "next/link"
import { getStyleBadgeText } from "@/app/(authenticated)/create/utils/style-utils"

export const ImageCard = memo(function ImageCard({ 
  image 
}: { 
  image: StorageImage
}) {
  return (
    <motion.div
      key={image.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
      layout
    >
      <Card className="overflow-hidden group">
        <Link href={`/image/${image.id}`}>
          <div className={cn(
            "aspect-square relative",
            image.format === 'SVG' 
              ? "bg-[conic-gradient(at_top_left,_var(--tw-gradient-stops))] from-slate-100 via-slate-100 to-slate-200 bg-grid-small p-4" 
              : "bg-muted"
          )}>
            {image.format === 'SVG' ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image.image_url}
                alt={image.prompt}
                className="w-full h-full object-contain"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  e.currentTarget.parentElement?.querySelector('.fallback')?.classList.remove('hidden')
                }}
              />
            ) : (
              <Image
                src={image.image_url}
                alt={image.prompt}
                fill
                className="object-cover"
                loading="lazy"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  e.currentTarget.parentElement?.querySelector('.fallback')?.classList.remove('hidden')
                }}
              />
            )}
            
            {/* Fallback for failed images */}
            <div className="fallback hidden absolute inset-0 items-center justify-center p-6">
              <div className="w-full h-full flex flex-col items-center justify-center text-center border-2 border-dashed border-muted-foreground/25 rounded-lg">
                <div className="rounded-full bg-muted-foreground/10 p-4 mb-4">
                  <ImageOff className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="font-medium text-muted-foreground">Image Unavailable</p>
              </div>
            </div>
          </div>
        </Link>

        <div className="p-4 space-y-3">
          <Link href={`/image/${image.id}`}>
            <p className="text-sm line-clamp-2 font-medium hover:text-primary">
              {image.prompt}
            </p>
          </Link>

          <div className="flex flex-wrap gap-2">
            {image.style && (
              <Badge variant="outline" className="text-xs">
                {getStyleBadgeText(image.style)}
              </Badge>
            )}
            
            <Badge variant="secondary" className="text-xs">
              {image.format}
            </Badge>
          </div>

          {/* Creation Time */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>
              {formatDistanceToNow(new Date(image.created_at), { addSuffix: true })}
            </span>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}) 