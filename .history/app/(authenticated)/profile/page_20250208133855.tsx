"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useUser } from "@/hooks/use-user"
import { getUserImages, createSecureImageUrl } from "@/services/images"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import Image from "next/image"
import { Download, ExternalLink, ImageOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { useInView } from "react-intersection-observer"
import { motion } from "framer-motion"
import NProgress from "nprogress"

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

interface FileSystemFileHandle {
  createWritable(): Promise<FileSystemWritableFileStream>;
}

interface FileSystemWritableFileStream {
  write(data: any): Promise<void>;
  close(): Promise<void>;
}

interface Window {
  showSaveFilePicker?: (options: {
    suggestedName: string;
    types: Array<{
      description: string;
      accept: Record<string, string[]>;
    }>;
  }) => Promise<FileSystemFileHandle>;
}

export default function ProfilePage() {
  const { user, loading: userLoading } = useUser()
  const [images, setImages] = useState<UserImage[]>([])
  const [loading, setLoading] = useState(true)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)
  const [sharingId, setSharingId] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const { ref, inView } = useInView()
  const ITEMS_PER_PAGE = 12
  const timerRef = useRef<NodeJS.Timeout>()

  // Move loadImages to useCallback to avoid scope issues
  const loadImages = useCallback(async (pageNum: number) => {
    if (user?.id) {
      NProgress.start()
      try {
        const { data, error } = await getUserImages(user.id, pageNum, ITEMS_PER_PAGE)
        if (error) throw error
        
        if (data) {
          setImages(prev => pageNum === 1 ? data : [...prev, ...data])
          setHasMore(data.length === ITEMS_PER_PAGE)
        }
      } catch (error) {
        console.error('Error loading images:', error)
      } finally {
        setLoading(false)
        NProgress.done()
      }
    }
  }, [user?.id])

  // Initial load
  useEffect(() => {
    if (user) {
      loadImages(1)
    }
  }, [user, loadImages])

  // Infinite scroll effect
  useEffect(() => {
    if (inView && hasMore && !loading) {
      const nextPage = page + 1
      setPage(nextPage)
      loadImages(nextPage)
    }
  }, [inView, hasMore, loading, page, loadImages])

  // Clean up function for timers
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  // Update the download handler with proper error typing
  const handleDownload = async (imageUrl: string, prompt: string, imageId: string) => {
    if (downloadingId) return

    NProgress.start()
    try {
      setDownloadingId(imageId)
      const response = await fetch(createSecureImageUrl(imageUrl))
      const blob = await response.blob()
      
      const filename = prompt 
        ? prompt.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50)
        : `image-${Date.now()}`

      try {
        if (window.showSaveFilePicker) {
          const handle = await window.showSaveFilePicker({
            suggestedName: `${filename}.png`,
            types: [{
              description: 'PNG Image',
              accept: {
                'image/png': ['.png'],
              },
            }],
          })
          
          const writable = await handle.createWritable()
          await writable.write(blob)
          await writable.close()
          
          toast.success("Image downloaded successfully")
        } else {
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `${filename}.png`
          document.body.appendChild(a)
          a.click()
          
          // Use ref for timeout
          timerRef.current = setTimeout(() => {
            URL.revokeObjectURL(url)
            document.body.removeChild(a)
          }, 100)
          
          toast.success("Image downloaded successfully")
        }
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          throw error
        }
      }
    } catch (error) {
      console.error('Download error:', error)
      toast.error("Failed to download image")
    } finally {
      setDownloadingId(null)
      NProgress.done()
    }
  }

  // Add share handler
  const handleShare = async (imageUrl: string, prompt: string, imageId: string) => {
    if (sharingId) return
    
    NProgress.start()
    try {
      setSharingId(imageId)
      if (navigator.share) {
        await navigator.share({
          title: 'Generated Image',
          text: prompt || 'Check out this AI-generated image!',
          url: createSecureImageUrl(imageUrl)
        })
      } else {
        await navigator.clipboard.writeText(createSecureImageUrl(imageUrl))
        toast.success("Image URL copied to clipboard")
      }
    } catch (error) {
      console.error('Share error:', error)
      toast.error("Failed to share image")
    } finally {
      setSharingId(null)
      NProgress.done()
    }
  }

  // Update navigator.share check
  const canShare = typeof navigator !== 'undefined' && 
    navigator.share && 
    typeof navigator.share === 'function'

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
          {images.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="w-full"
            >
              <Card className="overflow-hidden group">
                <div className="aspect-square relative bg-muted">
                  <Image
                    src={image.image_url}
                    alt={image.prompt}
                    fill
                    className="object-cover transition-opacity duration-200"
                    onError={(e) => {
                      // Hide the errored image
                      e.currentTarget.style.display = 'none'
                      // Show fallback
                      e.currentTarget.parentElement?.querySelector('.fallback')?.classList.remove('hidden')
                    }}
                  />
                  {/* Fallback for failed images */}
                  <div className="fallback hidden absolute inset-0 items-center justify-center p-6" 
                    style={{ display: 'none' }}
                  >
                    <div className="w-full h-full flex flex-col items-center justify-center text-center border-2 border-dashed border-muted-foreground/25 rounded-lg">
                      <div className="rounded-full bg-muted-foreground/10 p-4 mb-4">
                        <ImageOff className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <p className="font-medium text-muted-foreground">Image Unavailable</p>
                      <p className="text-sm text-muted-foreground/75 mt-1 max-w-[200px]">
                        This image could not be loaded
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  {/* Prompt - only if available */}
                  {image.prompt && (
                    <p className="text-sm line-clamp-2 font-medium">
                      {image.prompt}
                    </p>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className={cn(
                        "flex-1 h-8",
                        downloadingId === image.id && "opacity-50 cursor-not-allowed"
                      )}
                      onClick={() => handleDownload(image.image_url, image.prompt, image.id)}
                      disabled={downloadingId === image.id}
                    >
                      {downloadingId === image.id ? (
                        <>
                          <LoadingSpinner className="h-4 w-4 mr-2" />
                          Downloading...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className={cn(
                        "flex-1 h-8",
                        sharingId === image.id && "opacity-50 cursor-not-allowed"
                      )}
                      onClick={() => handleShare(image.image_url, image.prompt, image.id)}
                      disabled={sharingId === image.id}
                    >
                      {sharingId === image.id ? (
                        <>
                          <LoadingSpinner className="h-4 w-4 mr-2" />
                          {canShare ? "Sharing..." : "Copying..."}
                        </>
                      ) : (
                        <>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          {canShare ? "Share" : "Copy Link"}
                        </>
                      )}
                    </Button>
                  </div>
                  
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
            </motion.div>
          ))}
          {/* Intersection observer target */}
          {hasMore && (
            <div ref={ref} className="col-span-full flex justify-center p-4">
              <LoadingSpinner className="h-8 w-8" />
            </div>
          )}
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