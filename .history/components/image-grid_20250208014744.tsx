'use client'

import Image from 'next/image'
import { useState } from 'react'
import { StorageImage } from '@/types/image'

interface ImageGridProps {
  images: StorageImage[]
}

export function ImageGrid({ images }: ImageGridProps) {
  const [selectedImage, setSelectedImage] = useState<StorageImage | null>(null)

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((image) => (
        <div
          key={image.id}
          className="relative aspect-square overflow-hidden rounded-lg cursor-pointer"
          onClick={() => setSelectedImage(image)}
        >
          <Image
            src={image.url}
            alt={image.name}
            fill
            className="object-cover transition-transform hover:scale-105"
            loading="lazy"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        </div>
      ))}

      {selectedImage && (
        <ImageModal
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  )
} 