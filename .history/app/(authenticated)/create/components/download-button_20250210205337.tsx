"use client"

import { DownloadCloud, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DownloadButtonProps {
  currentImage: string
  isDownloading: boolean
  imageLoading: boolean
  originalFormat: 'svg' | 'png' | 'jpg'
  onDownload: (format: 'png' | 'jpg' | 'svg') => void
}

export function DownloadButton({
  currentImage,
  isDownloading,
  imageLoading,
  originalFormat,
  onDownload
}: DownloadButtonProps) {
  return (
    <div className="flex justify-end mt-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            disabled={!currentImage || isDownloading || imageLoading}
            className={cn(
              "w-[180px] transition-all duration-200",
              (isDownloading || imageLoading) && "opacity-80"
            )}
          >
            {isDownloading ? (
              <>
                <LoadingSpinner className="mr-2 h-4 w-4" />
                Downloading...
              </>
            ) : (
              <>
                <DownloadCloud className="mr-2 h-4 w-4" />
                Download As
                <ChevronDown className="ml-2 h-4 w-4 opacity-70" />
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[180px]">
          <DropdownMenuItem onClick={() => onDownload('png')}>
            PNG Image
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDownload('jpg')}>
            JPG Image
          </DropdownMenuItem>
          {originalFormat === 'svg' && (
            <DropdownMenuItem onClick={() => onDownload('svg')}>
              SVG Vector
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
} 