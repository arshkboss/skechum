"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Button } from "@/components/ui/button"
import { Share, ChevronLeft, ImageOff } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { detectImageFormat, convertImage } from '@/utils/image-utils'
import { createSecureImageUrl } from "@/services/images"
import NProgress from "nprogress"
import { useToast } from "@/hooks/use-toast"
import { DownloadButton } from "@/app/(authenticated)/create/components/download-button"
import { createClient } from "@/utils/supabase/client"

interface ImageDetail {
  id: string
  image_url: string
  prompt: string
  style: string | null
  format: 'PNG' | 'SVG' | 'JPG'
  settings: {
    model: string
    size: string
    steps?: number
    guidance?: number
  }
  generation_time: number
  created_at: string
}

async function checkAuth() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  return !!session
}

export default function ImageDetailPage() {
  const params = useParams()
  const [image, setImage] = useState<ImageDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [imageLoading, setImageLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)
  const [sharing, setSharing] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const { toast } = useToast()
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  // Fetch image data immediately
  useEffect(() => {
    let mounted = true

    async function fetchImage() {
      try {
        const response = await fetch(`/api/images/${params.id}`)
        if (!response.ok) throw new Error('Image not found')
        const data = await response.json()
        if (mounted) {
          setImage(data)
          setLoading(false)
        }
      } catch (error) {
        console.error('Error fetching image:', error)
        if (mounted) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load image",
          })
          setLoading(false)
        }
      }
    }

    if (params.id) {
      fetchImage()
    }

    return () => { mounted = false }
  }, [params.id, toast])

  useEffect(() => {
    const checkAuthStatus = async () => {
      const isAuthed = await checkAuth()
      setIsAuthenticated(isAuthed)
    }
    checkAuthStatus()
  }, [])

  // Add event listener for right click
  useEffect(() => {
    const handleRightClick = (e: MouseEvent) => {
      e.preventDefault()
      toast({
        title: "Image Protected",
        description: "Please use the download button to save this image",
        variant: "default",
      })
      return false
    }

    // Add the event listener
    document.addEventListener('contextmenu', handleRightClick)

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', handleRightClick)
    }
  }, [toast])

  const handleDownload = async (format: 'PNG' | 'SVG' | 'JPG') => {
    if (!image || downloading) return

    if (!isAuthenticated) {
      const currentPath = `/image/${params.id}`
      const returnUrl = encodeURIComponent(currentPath)
      
      router.push(`/sign-in?return_url=${returnUrl}`)
      return
    }

    NProgress.start()
    try {
      setDownloading(true)
      
      const originalFormat = await detectImageFormat(image.image_url)
      const blob = await convertImage(image.image_url, originalFormat, format)
      
      const filename = image.prompt 
        ? image.prompt.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50)
        : `image-${Date.now()}`

      try {
        if (window.showSaveFilePicker) {
          const handle = await window.showSaveFilePicker({
            suggestedName: `${filename}.${format.toLowerCase()}`,
            types: [{
              description: `${format} Image`,
              accept: {
                [`image/${format.toLowerCase()}`]: [`.${format.toLowerCase()}`],
              },
            }],
          })
          
          const writable = await handle.createWritable()
          await writable.write(blob)
          await writable.close()
          
          toast({
            title: "Success",
            description: "Image downloaded successfully",
          })
        } else {
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `${filename}.${format.toLowerCase()}`
          document.body.appendChild(a)
          a.click()
          URL.revokeObjectURL(url)
          document.body.removeChild(a)
          toast({
            title: "Success",
            description: "Image downloaded successfully",
          })
        }
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          throw error
        }
      }
    } catch (error) {
      console.error('Download error:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to download image",
      })
    } finally {
      setDownloading(false)
      NProgress.done()
    }
  }

  const handleShare = async () => {
    if (!image || sharing) return
    
    NProgress.start()
    try {
      setSharing(true)
      await navigator.clipboard.writeText(createSecureImageUrl(image.image_url))
      toast({
        title: "Success",
        description: "Image link copied to clipboard",
      })
    } catch (error) {
      console.error('Share error:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to copy link",
      })
    } finally {
      setSharing(false)
      NProgress.done()
    }
  }

  const formatTime = (ms: number) => {
    return `${(ms / 1000).toFixed(1)}s`
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button - Always visible */}
        <Button 
          variant="link"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
          onClick={() => router.back()}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-8">
          {/* Image Preview Section - Show skeleton while loading */}
          <Card className="overflow-hidden">
            {loading ? (
              // Skeleton for image
              <div className="aspect-square bg-muted animate-pulse flex items-center justify-center">
                <LoadingSpinner className="h-8 w-8" />
              </div>
            ) : image ? (
              <div className={cn(
                "aspect-square relative",
                image.format === 'SVG' 
                  ? "bg-[conic-gradient(at_top_left,_var(--tw-gradient-stops))] from-slate-100 via-slate-100 to-slate-200 bg-grid-small p-4" 
                  : "bg-muted"
              )}>
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted/50 z-10">
                    <LoadingSpinner className="h-8 w-8" />
                  </div>
                )}
                <img
                  src={image.image_url}
                  alt={image.prompt}
                  className={cn(
                    "w-full h-full object-contain",
                    imageLoading && "opacity-0"
                  )}
                  onLoad={() => setImageLoading(false)}
                  onError={(e) => {
                    setImageLoading(false)
                    e.currentTarget.style.display = 'none'
                    e.currentTarget.parentElement?.querySelector('.fallback')?.classList.remove('hidden')
                  }}
                />
              </div>
            ) : (
              // Error state for image
              <div className="aspect-square bg-muted flex items-center justify-center">
                <div className="text-center">
                  <ImageOff className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Image not found</p>
                </div>
              </div>
            )}
          </Card>

          {/* Details Section */}
          <div className="space-y-6">
            {/* Prompt Section */}
            <div>
              <h2 className="text-lg font-semibold mb-2">Prompt</h2>
              {loading ? (
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
              ) : image?.prompt ? (
                <p className="text-muted-foreground">{image.prompt}</p>
              ) : (
                <p className="text-muted-foreground italic">No prompt available</p>
              )}
            </div>

            {/* Actions */}
            <div className="">
              <DownloadButton
                currentImage={image?.image_url || ''}
                isDownloading={downloading}
                imageLoading={imageLoading || loading}
                originalFormat={image?.format || 'PNG'}
                onDownload={handleDownload}
              />

              <Button 
                variant="outline"
                onClick={handleShare}
                disabled={sharing || loading || !image}
              >
                {sharing ? (
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

            {/* Details */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Details</h3>
                {loading ? (
                  <div className="animate-pulse flex gap-2">
                    <div className="h-6 bg-muted rounded w-16"></div>
                    <div className="h-6 bg-muted rounded w-16"></div>
                  </div>
                ) : image ? (
                  <div className="flex flex-wrap gap-2">
                    {image.settings.size && (
                      <Badge variant="secondary">
                        {image.settings.size}
                      </Badge>
                    )}
                    <Badge 
                      variant={image.format === 'SVG' ? "secondary" : "outline"}
                      className={cn(
                        image.format === 'SVG' && "font-medium"
                      )}
                    >
                      {image.format}
                    </Badge>
                  </div>
                ) : null}
              </div>

              <div className="text-sm text-muted-foreground">
                {loading ? (
                  <div className="animate-pulse h-4 bg-muted rounded w-48"></div>
                ) : image ? (
                  <div className="flex items-center gap-2">
                    {image.generation_time && (
                      <span className="flex items-center gap-1">
                        Generated in
                        <Badge variant="secondary" className="text-[10px]">
                          {formatTime(image.generation_time)}
                        </Badge>
                      </span>
                    )}
                    <span>•</span>
                    <span>
                      {formatDistanceToNow(new Date(image.created_at), { addSuffix: true })}
                    </span>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 