"use client"

import { useState, useEffect, useCallback, memo } from "react"
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
import { getImages } from './server-components/image-loader'
import { ClientProfilePage } from "./components/client-profile"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createServerClient } from "@supabase/ssr"
import { StorageImage } from "@/app/types/image"

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

// Make the page component async
export default async function ProfilePage({
  searchParams
}: {
  searchParams: { page?: string }
}) {
  
  const supabase = await createClient()
  
  // Get session
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    redirect("/login")
  }

  const userId = session.user.id
  const page = Number(searchParams.page) || 1
  const ITEMS_PER_PAGE = 12

  // Get initial data from server
  const { data: initialImages, count } = await getImages(userId, page, ITEMS_PER_PAGE)
  const totalPages = Math.ceil((count || 0) / ITEMS_PER_PAGE)

  // Handle null data case
  const safeImages = (initialImages || []) as StorageImage[]

  return (
    <ClientProfilePage 
      initialImages={safeImages}
      initialPage={page} 
      totalPages={totalPages} 
      itemsPerPage={ITEMS_PER_PAGE}
    />
  )
} 