'use client'

import { StorageImage } from "@/app/types/image"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import Image from "next/image"

interface ImageModalProps {
  image: StorageImage
  onClose: () => void
}

export function ImageModal({ image, onClose }: ImageModalProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <div className="relative aspect-square">
          <Image
            src={image.image_url}
            alt={image.prompt}
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className="p-4 space-y-2">
          <h2 className="text-xl font-semibold">{image.prompt}</h2>
          {image.description && (
            <p className="text-gray-600 dark:text-gray-300">{image.description}</p>
          )}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-500">Style: {image.style}</span>
            <span className="text-sm text-gray-500">Format: {image.format}</span>
            {image.keywords && (
              <span className="text-sm text-gray-500">Keywords: {image.keywords}</span>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 