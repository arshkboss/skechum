"use client"

import { Share } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { DownloadButton } from "@/app/(authenticated)/create/components/download-button"

interface ActionButtonsProps {
  currentImage: string
  isDownloading: boolean
  imageLoading: boolean
  originalFormat: 'PNG' | 'SVG' | 'JPG'
  onDownload: (format: 'PNG' | 'SVG' | 'JPG') => void
  onShare: () => void
  isSharing: boolean
  disabled?: boolean
}

export function ActionButtons({
  currentImage,
  isDownloading,
  imageLoading,
  originalFormat,
  onDownload,
  onShare,
  isSharing,
  disabled
}: ActionButtonsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 w-full">
      <div className="w-full">
        <DownloadButton
          currentImage={currentImage}
          isDownloading={isDownloading}
          imageLoading={imageLoading}
          originalFormat={originalFormat}
          onDownload={onDownload}
        />
      </div>
      <Button 
        variant="outline"
        onClick={onShare}
        disabled={disabled || isSharing}
        className="w-full"
      >
        {isSharing ? (
          <>
            <LoadingSpinner className="mr-2 h-4 w-4" />
            Copying...
          </>
        ) : (
          <>
            <Share className="mr-2 h-4 w-4" />
            Copy Link
          </>
        )}
      </Button>
    </div>
  )
} 