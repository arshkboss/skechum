"use client"

import { useState, useEffect, useCallback, memo, useRef } from "react"
import { useUser } from "@/hooks/use-user"
import { getUserImages, createSecureImageUrl } from "@/services/images"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import Image from "next/image"
import { Download, ExternalLink, ImageOff, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import NProgress from "nprogress"
import { detectImageFormat, convertImage } from '@/utils/image-utils'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { getStyleBadgeText } from "@/app/(authenticated)/create/utils/style-utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PaymentsHistory } from "./components/payments-history"
import CreditsLog from "./components/credits-log"
import { useSearchParams } from 'next/navigation'
import { Skeleton } from "@/components/ui/skeleton"

interface UserImage {
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

interface FileSystemFileHandle {
  createWritable(): Promise<FileSystemWritableFileStream>;
}

interface FileSystemWritableFileHandle {
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
function toTitleCase(str: string) {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(' ')
}

// Create a memoized image component to prevent re-renders
const MemoizedImage = memo(function MemoizedImage({ 
  image, 
  onError 
}: { 
  image: UserImage,
  onError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void 
}) {
  return image.format === 'SVG' ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={image.image_url}
      alt={image.prompt}
      className="w-full h-full object-contain"
      loading="lazy"
      decoding="async"
      onError={onError}
      // Add cache control attributes
      fetchPriority="auto"
      referrerPolicy="no-referrer"
    />
  ) : (
    <Image
      src={image.image_url}
      alt={image.prompt}
      fill
      className="object-cover"
      loading="lazy"
      decoding="async"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      onError={onError}
      // Add cache control
      priority={false}
      unoptimized={true} // Prevent Next.js from re-optimizing cached images
    />
  )
})

// Create a memoized card component
const ImageCard = memo(function ImageCard({ 
  image,
  onDownload,
  onShare,
  downloadingId,
  sharingId
}: {
  image: UserImage
  onDownload: (url: string, prompt: string, id: string, format: 'PNG' | 'SVG' | 'JPG') => void
  onShare: (url: string, prompt: string, id: string) => void
  downloadingId: string | null
  sharingId: string | null
}) {
  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.style.display = 'none'
    e.currentTarget.parentElement?.querySelector('.fallback')?.classList.remove('hidden')
  }, [])

  return (
    <motion.div
      key={image.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
      layout
    >
      <Card className="overflow-hidden group">
        <Link href={`/image/${image.id}`}>
          <div className={cn(
            "aspect-square relative",
            image.format === 'SVG' 
              ? "bg-[conic-gradient(at_top_left,_var(--tw-gradient-stops))] from-slate-100 via-slate-100 to-slate-200 bg-grid-small p-4" 
              : "bg-muted"
          )}>
            <MemoizedImage image={image} onError={handleImageError} />
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
        </Link>
        <div className="p-4 space-y-3">
          {/* Prompt with its own link */}
          {image.prompt && (
            <Link href={`/image/${image.id}`}>
              <p className="text-sm line-clamp-2 font-medium hover:text-primary">
                {toTitleCase(image.prompt)}
              </p>
            </Link>
          )}
          
          {/* Action Buttons */}
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className={cn(
                    "flex-1 h-8",
                    downloadingId === image.id && "opacity-50 cursor-not-allowed"
                  )}
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
                      Download As
                    </>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px]">
                <DropdownMenuItem 
                  onClick={() => onDownload(image.image_url, image.prompt, image.id, 'PNG')}
                >
                  PNG Image
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDownload(image.image_url, image.prompt, image.id, 'JPG')}
                >
                  JPG Image
                </DropdownMenuItem>
                {image.format === 'SVG' && (
                  <DropdownMenuItem 
                    onClick={() => onDownload(image.image_url, image.prompt, image.id, 'SVG')}
                  >
                    SVG Vector
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              size="sm"
              variant="outline"
              className={cn(
                "flex-1 h-8",
                sharingId === image.id && "opacity-50 cursor-not-allowed"
              )}
              onClick={(e) => {
                e.preventDefault() // Prevent any parent click events
                onShare(image.image_url, image.prompt, image.id)
              }}
              disabled={sharingId === image.id}
            >
              {sharingId === image.id ? (
                <>
                  <LoadingSpinner className="h-4 w-4 mr-2" />
                  Copying...
                </>
              ) : (
                <>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Copy Link
                </>
              )}
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {/* Model Badge - only if available */}
            {image.style && (
              <Badge variant="outline" className="text-xs">
                {getStyleBadgeText(image.style)}
              </Badge>
            )}

            {/* Size Badge - only if available */}
            {image.settings.size && (
              <Badge variant="secondary" className="text-xs">
                {image.settings.size.toUpperCase()}
              </Badge>
            )}
            
            {/* Format Badge */}
            <Badge 
              variant={image.format === 'SVG' ? "secondary" : "outline"} 
              className={cn(
                "text-xs",
                image.format === 'SVG' && "font-medium"
              )}
            >
              {image.format}
            </Badge>
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
  )
})

// Move scrollToTop outside
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

export default function ProfilePage() {
  const { user, loading: userLoading } = useUser()
  const [images, setImages] = useState<UserImage[]>([])
  const [loading, setLoading] = useState(true)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)
  const [sharingId, setSharingId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const ITEMS_PER_PAGE = 12
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const defaultTab = searchParams.get('tab') || "images"

  // Simplify loadImages function
  const loadImages = useCallback(async (pageNum: number, userId: string) => {
    if (!userId) return
    
    setLoading(true)
    NProgress.start()
    
    try {
      const { data, error, count } = await getUserImages(userId, pageNum, ITEMS_PER_PAGE)
      
      if (error) throw error
      
      if (data) {
        setImages(data)
        setTotalPages(Math.ceil((count || 0) / ITEMS_PER_PAGE))
      }
    } catch (error) {
      console.error('Error loading images:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load images"
      })
      setImages([])
    } finally {
      setLoading(false)
      NProgress.done()
    }
  }, [toast])

  // Simplify initial load
  useEffect(() => {
    if (user?.id) {
      console.log('Loading initial images for user:', user.id)
      loadImages(1, user.id)
    }
  }, [user?.id, loadImages])

  // Simplify pagination controls
  const PaginationControls = ({ className }: { className?: string }) => (
    <div className={cn("flex items-center justify-center gap-4", className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          if (!user?.id) return
          const newPage = currentPage - 1
          scrollToTop()
          setCurrentPage(newPage)
          loadImages(newPage, user.id)
        }}
        disabled={currentPage === 1 || loading || !user?.id}
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        Previous
      </Button>
      
      <span className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </span>

      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          if (!user?.id) return
          const newPage = currentPage + 1
          scrollToTop()
          setCurrentPage(newPage)
          loadImages(newPage, user.id)
        }}
        disabled={currentPage >= totalPages || loading || !user?.id}
      >
        Next
        <ChevronRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  )

  // Update the download handler to handle different formats
  const handleDownload = async (
    imageUrl: string, 
    prompt: string, 
    imageId: string, 
    format: 'PNG' | 'SVG' | 'JPG'
  ) => {
    if (downloadingId) return

    NProgress.start()
    try {
      setDownloadingId(imageId)
      
      // Convert image if needed
      const originalFormat = await detectImageFormat(imageUrl)
      const blob = await convertImage(imageUrl, originalFormat, format)
      
      const filename = prompt 
        ? prompt.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50)
        : `image-${Date.now()}`

      try {
        // Check if File System Access API is supported
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
            variant: "success",
            title: "Success",
            description: "Image downloaded successfully",
          })
        } else {
          // Fall back to traditional method
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `${filename}.${format.toLowerCase()}`
          document.body.appendChild(a)
          a.click()
          URL.revokeObjectURL(url)
          toast({
            variant: "success",
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
      setDownloadingId(null)
      NProgress.done()
    }
  }

  // Add share handler
  const handleShare = async (imageUrl: string, prompt: string, imageId: string) => {
    if (sharingId || !imageUrl) return
    
    NProgress.start()
    try {
      setSharingId(imageId)
      await navigator.clipboard.writeText(createSecureImageUrl(imageUrl))
      toast({
        variant: "success",
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
      setSharingId(null)
      NProgress.done()
    }
  }

  // Memoize handlers
  const handleDownloadMemo = useCallback(handleDownload, [])
  const handleShareMemo = useCallback(handleShare, [])

  if (userLoading) {
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
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Profile</h1>
        <p className="text-muted-foreground">{user.email}</p>
      </div>

      <Tabs defaultValue={defaultTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="creations">Creations</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="credits">Generation Log</TabsTrigger>
        </TabsList>

        <TabsContent value="creations" className="space-y-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-square rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : images.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {images.map((image) => (
                  <ImageCard
                    key={image.id}
                    image={image}
                    onDownload={handleDownloadMemo}
                    onShare={handleShareMemo}
                    downloadingId={downloadingId}
                    sharingId={sharingId}
                  />
                ))}
              </div>
              {totalPages > 1 && <PaginationControls className="mt-8" />}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
              <h2 className="text-2xl font-bold mb-2">No Images Yet</h2>
              <p className="text-muted-foreground">
                Start creating to see your images here
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="payments">
          <PaymentsHistory />
        </TabsContent>

        <TabsContent value="credits">
          <CreditsLog />
        </TabsContent>
      </Tabs>
    </div>
  )
} 