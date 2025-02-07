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
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-4 flex flex-col justify-between text-white">
                  <p className="text-sm line-clamp-3">{image.prompt}</p>
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <Badge variant="outline" className="bg-black/50">
                        {image.settings.model}
                      </Badge>
                      {image.generation_time && (
                        <Badge variant="outline" className="block bg-black/50">
                          {(image.generation_time / 1000).toFixed(1)}s
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 bg-black/50 hover:bg-black/70"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 bg-black/50 hover:bg-black/70"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(image.created_at), { addSuffix: true })}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="secondary" className="text-xs">
                        {image.settings.size}
                      </Badge>
                      {image.settings.steps && (
                        <Badge variant="outline" className="text-xs">
                          {image.settings.steps} steps
                        </Badge>
                      )}
                    </div>
                  </div>
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