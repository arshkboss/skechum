"use client"

import { Sparkles } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import PencilLoader from "@/components/ui/pencil-loader"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { GenerationStatus } from "@/app/(authenticated)/create/types"





interface ImagePreviewProps {
  status: GenerationStatus
  currentImage: string
  prompt: string
  imageLoading: boolean
  elapsedTime: number
  generationTime: number | null
  onImageLoad: () => void
  formatTime: (ms: number) => string
}

export function ImagePreview({
  status,
  currentImage,
  prompt,
  imageLoading,
  elapsedTime,
  generationTime,
  onImageLoad,
  formatTime
}: ImagePreviewProps) {
  return (
    <Card className="p-3 sm:p-6 space-y-3 sm:space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-sm sm:text-base">Preview</h2>
        <div className="flex items-center gap-2">
          {status !== 'idle' && (
            <Badge variant={
              status === 'completed' ? 'success' :
              status === 'failed' ? 'destructive' :
              'secondary'
            }
            className="text-xs"
            >
              {status === 'queued' && 'In Queue'}
              {status === 'generating' && 'Generating...'}
              {status === 'completed' && 'Complete'}
              {status === 'failed' && 'Failed'}
            </Badge>
          )}
          {(status === 'queued' || status === 'generating' || imageLoading) ? (
            <Badge variant="outline" className="font-mono text-xs">
              {formatTime(elapsedTime)}
            </Badge>
          ) : generationTime && status === 'completed' ? (
            <Badge variant="outline" className="font-mono text-xs">
              {formatTime(generationTime)}
            </Badge>
          ) : null}
        </div>
      </div>

      <Card className="aspect-square relative overflow-hidden bg-dot-pattern">
        {currentImage ? (
          <>
            <Image
              src={currentImage}
              alt={prompt}
              fill
              className={cn(
                "object-contain transition-opacity duration-300",
                imageLoading ? "opacity-0" : "opacity-100"
              )}
              priority
              onLoad={onImageLoad}
            />
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                <div className="text-center">
                  <PencilLoader />
                  <p className="text-sm text-muted-foreground">Loading image...</p>
                </div>
              </div>

            )}
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-muted/50 to-muted p-6">
            <div className="h-full flex flex-col items-center justify-center text-center border-2 border-dashed border-muted-foreground/25 rounded-lg">
              {(status === 'generating' || status === 'queued') ? (
                <>
                  <div className="rounded-full  p-4 mb-4">
                    <PencilLoader />
                  </div>
                  <p className="font-medium">
                    {status === 'queued' ? 'Waiting in Queue' : 'Creating Your Image'}

                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {status === 'queued' 
                      ? 'Your request is being processed...' 
                      : 'This might take a few seconds...'}
                  </p>
                </>
              ) : (
                <>
                  <div className="rounded-full bg-primary/10 p-4 mb-4">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <p className="font-medium">Preview Area</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your generated image will appear here
                  </p>
                </>
              )}
            </div>
          </div>
        )}
      </Card>
    </Card>
  )
} 