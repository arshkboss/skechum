'use client'

import { StorageImage } from "@/types/image"
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
            src={image.url}
            alt={image.name}
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-2">{image.name}</h2>
          {image.description && (
            <p className="text-gray-600 dark:text-gray-300">{image.description}</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 