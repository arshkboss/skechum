"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { UserImage } from "../types" // Create this type file
import { ImageCard } from "./image-card" // Move ImageCard to separate component
import { PaginationControls } from "./pagination-controls" // Move PaginationControls to separate component

// Move all the client-side logic here
export function ClientProfilePage({
  initialImages,
  initialPage,
  totalPages,
  itemsPerPage
}: {
  initialImages: UserImage[]
  initialPage: number
  totalPages: number
  itemsPerPage: number
}) {
  const [images, setImages] = useState<UserImage[]>(initialImages)
  const [currentPage, setCurrentPage] = useState(initialPage)
  const router = useRouter()

  // Handle page changes
  const handlePageChange = (newPage: number) => {
    scrollToTop()
    router.push(`/profile?page=${newPage}`)
  }

  return (
    <div className="container mx-auto p-8">
      {/* Profile Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Creations</h1>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Badge variant="secondary">
              {images.length} Images
            </Badge>
          </div>
          
          {/* Top pagination - only visible on desktop */}
          {images.length > 0 && (
            <div className="hidden md:block">
              <PaginationControls 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>

      {/* Image Grid */}
      {images.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {images.map((image) => (
              <ImageCard
                key={image.id}
                image={image}
              />
            ))}
          </div>
          
          {/* Bottom pagination - always visible */}
          <PaginationControls 
            className="mt-8"
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No Images Yet</h3>
          <p className="text-muted-foreground">
            Start generating images to see them here
          </p>
        </div>
      )}
    </div>
  )
} 