"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Button } from "@/components/ui/button"
import { Download, Share, ChevronLeft, ImageOff } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { detectImageFormat, convertImage } from '@/utils/image-utils'
import { createSecureImageUrl } from "@/services/images"
import NProgress from "nprogress"
import { useToast } from "@/hooks/use-toast"

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

export default function ImageDetailPage() {
  const params = useParams()
  const [image, setImage] = useState<ImageDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)
  const [sharing, setSharing] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchImage() {
      try {
        const response = await fetch(`/api/images/${params.id}`)
        if (!response.ok) throw new Error('Image not found')
        const data = await response.json()
        setImage(data)
      } catch (error) {
        console.error('Error fetching image:', error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load image",
        })
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchImage()
    }
  }, [params.id, toast])

  const handleDownload = async (format: 'PNG' | 'SVG' | 'JPG') => {
    if (!image || downloading) return

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    )
  }

  if (!image) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Image Not Found</h1>
        <Link href="/profile" className="text-primary hover:underline">
          Return to Profile
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link 
          href="/profile" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Profile
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-8">
          {/* Image Display */}
          <Card className="overflow-hidden">
            <div className={cn(
              "aspect-square relative",
              image.format === 'SVG' 
                ? "bg-[conic-gradient(at_top_left,_var(--tw-gradient-stops))] from-slate-100 via-slate-100 to-slate-200 bg-grid-small p-4" 
                : "bg-muted"
            )}>
              {image.format === 'SVG' ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={image.image_url}
                  alt={image.prompt}
                  className="w-full h-full object-contain"
                  loading="eager"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                    e.currentTarget.parentElement?.querySelector('.fallback')?.classList.remove('hidden')
                  }}
                />
              ) : (
                <Image
                  src={image.image_url}
                  alt={image.prompt}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                    e.currentTarget.parentElement?.querySelector('.fallback')?.classList.remove('hidden')
                  }}
                />
              )}
              <div className="fallback hidden absolute inset-0 items-center justify-center p-6">
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
          </Card>

          {/* Image Details */}
          <div className="space-y-6">
            {/* Prompt */}
            {image.prompt && (
              <div>
                <h2 className="text-lg font-semibold mb-2">Prompt</h2>
                <p className="text-muted-foreground">{image.prompt}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    className="flex-1"
                    disabled={downloading}
                  >
                    {downloading ? (
                      <>
                        <LoadingSpinner className="mr-2 h-4 w-4" />
                        Downloading...
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        Download As
                      </>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[180px]">
                  <DropdownMenuItem onClick={() => handleDownload('PNG')}>
                    PNG Image
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDownload('JPG')}>
                    JPG Image
                  </DropdownMenuItem>
                  {image.format === 'SVG' && (
                    <DropdownMenuItem onClick={() => handleDownload('SVG')}>
                      SVG Vector
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button 
                variant="outline"
                className="flex-1"
                onClick={handleShare}
                disabled={sharing}
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
                <div className="flex flex-wrap gap-2">
                  {image.settings.model && (
                    <Badge variant="outline">
                      {image.settings.model}
                    </Badge>
                  )}
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
              </div>

              <div className="text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  {image.generation_time && (
                    <span className="flex items-center gap-1">
                      Generated in
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
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 