"use client"

import { useState, useEffect } from "react"
import { useUser } from "@/hooks/use-user"
import { getUserImages } from "@/services/images"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import Image from "next/image"
import { Download, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"

interface UserImage {
  id: string
  image_url: string
  prompt: string
  style: string | null
  format: string
  settings: {
    model: string
    size: string
    steps?: number
    guidance?: number
  }
  generation_time: number
  created_at: string
}

export default function ProfilePage() {
  const { user, loading: userLoading } = useUser()
  const [images, setImages] = useState<UserImage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadImages() {
      if (user?.id) {
        try {
          const { data, error } = await getUserImages(user.id)
          if (error) throw error
          setImages(data || [])
        } catch (error) {
          console.error('Error loading images:', error)
        } finally {
          setLoading(false)
        }
      }
    }

    if (user) {
      loadImages()
    }
  }, [user])

  if (userLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <h2 className="text-2xl font-bold mb-2">Please Sign In</h2>
        <p className="text-muted-foreground">
          You need to be signed in to view your profile
        </p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-8">
      {/* Profile Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Creations</h1>
        <div className="flex items-center gap-4">
          <p className="text-muted-foreground">
            {user.email}
          </p>
          <Badge variant="secondary">
            {images.length} Images
          </Badge>
        </div>
      </div>

      {/* Image Grid */}
      {images.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {images.map((image) => (
            <Card key={image.id} className="overflow-hidden group">
              <div className="aspect-square relative">
                <Image
                  src={image.image_url}
                  alt={image.prompt}
                  fill
                  className="object-cover"
                />
                {/* Action Buttons */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8 bg-black/50 hover:bg-black/70 backdrop-blur-sm"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8 bg-black/50 hover:bg-black/70 backdrop-blur-sm"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="p-4 space-y-2">
                {/* Prompt - only if available */}
                {image.prompt && (
                  <p className="text-sm line-clamp-2 font-medium">
                    {image.prompt}
                  </p>
                )}
                
                <div className="flex flex-wrap gap-2">
                  {/* Model Badge - only if available */}
                  {image.settings.model && (
                    <Badge variant="outline" className="text-xs">
                      {image.settings.model}
                    </Badge>
                  )}
                  
                  {/* Size Badge - only if available */}
                  {image.settings.size && (
                    <Badge variant="secondary" className="text-xs">
                      {image.settings.size}
                    </Badge>
                  )}
                  
                  {/* Steps Badge - only if available */}
                  {image.settings.steps && (
                    <Badge variant="outline" className="text-xs">
                      {image.settings.steps} steps
                    </Badge>
                  )}
                </div>

                {/* Generation Time and Created At */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {image.generation_time && (
                    <span className="flex items-center gap-1">
                      <span>Generated in</span>
                      <Badge variant="secondary" className="text-[10px]">
                        {(image.generation_time / 1000).toFixed(1)}s
                      </Badge>
                    </span>
                  )}
                  <span>•</span>
                  <span>
                    {formatDistanceToNow(new Date(image.created_at), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
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