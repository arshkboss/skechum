"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { ImageOff, ChevronRight, Search } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import NProgress from "nprogress"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { useDebounce } from "@/hooks/use-debounce"

interface ExploreImage {
  id: string
  image_url: string
  prompt: string
  user_email: string
  model: string
  style: string | null
  created_at: string
  generation_time: number
  settings: {
    size: string
    steps?: number
  }
}

interface Category {
  id: string
  title: string
  description: string
  images: ExploreImage[]
  hasMore: boolean
  page: number
}

// Add this interface for API response
interface ExploreResponse {
  images: ExploreImage[]
  hasMore: boolean
  total: number
}

const ITEMS_PER_PAGE = 8
const CATEGORIES = [
  {
    id: 'all',
    title: 'All Images',
    description: 'Every creation on the platform'
  },
  {
    id: 'latest',
    title: 'Latest Creations',
    description: 'Fresh off the AI canvas'
  },
  
  {
    id: 'featured',
    title: 'Featured Artists',
    description: 'Exceptional artworks'
  }
]

function toTitleCase(str: string) {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(' ')
}

export default function ExplorePage() {
  const [categories, setCategories] = useState<Category[]>(
    CATEGORIES.map(cat => ({
      ...cat,
      images: [],
      hasMore: true,
      page: 1
    }))
  )

  const { ref, inView } = useInView()

  const [loading, setLoading] = useState<Record<string, boolean>>({})

  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 500)

  // Add this state to track loading state for each category
  const [loadingMore, setLoadingMore] = useState<Record<string, boolean>>({})

  const fetchImages = async (categoryId: string, page: number) => {
    setLoading(prev => ({ ...prev, [categoryId]: true }))
    NProgress.start()
    
    try {
      const params = new URLSearchParams({
        category: categoryId,
        page: page.toString(),
        limit: ITEMS_PER_PAGE.toString()
      })

      if (debouncedSearch) {
        params.append('search', debouncedSearch)
      }

      const response = await fetch(`/api/explore?${params}`)
      const data: ExploreResponse = await response.json()
      
      console.log(`[Explore] Received data for ${categoryId}:`, data)
      
      if (data && Array.isArray(data.images)) {
        setCategories(prev => prev.map(cat => {
          if (cat.id === categoryId) {
            // Create a Set of existing image IDs for deduplication
            const existingIds = new Set(cat.images.map(img => img.id))
            
            // Filter out any duplicate images from the new data
            const newImages = data.images.filter(img => !existingIds.has(img.id))
            
            return {
              ...cat,
              // For page 1, reset images. For subsequent pages, append unique new images
              images: page === 1 ? data.images : [...cat.images, ...newImages],
              hasMore: data.hasMore,
              page: page
            }
          }
          return cat
        }))
      } else {
        console.error(`[Explore] Invalid data format for ${categoryId}:`, data)
      }
    } catch (error) {
      console.error(`[Explore] Error fetching ${categoryId} images:`, error)
    } finally {
      setLoading(prev => ({ ...prev, [categoryId]: false }))
      NProgress.done()
    }
  }

  useEffect(() => {
    // Initial load for all categories
    CATEGORIES.forEach(cat => fetchImages(cat.id, 1))
  }, [debouncedSearch])

  const handleViewMore = async (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId)
    
    // Prevent multiple simultaneous requests for the same category
    if (category && category.hasMore && !loadingMore[categoryId]) {
      setLoadingMore(prev => ({ ...prev, [categoryId]: true }))
      
      try {
        await fetchImages(categoryId, category.page + 1)
      } finally {
        setLoadingMore(prev => ({ ...prev, [categoryId]: false }))
      }
    }
  }

  return (
    <div className="container mx-auto p-8 space-y-16">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search images..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {categories.map((category) => (
        <section key={category.id} className="space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-bold">{category.title}</h2>
              <p className="text-muted-foreground">{category.description}</p>
            </div>
            {category.hasMore && (
              <Button
                variant="ghost"
                className="group"
                onClick={() => handleViewMore(category.id)}
              >
                View More
                <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading[category.id] && !category.images.length && (
              Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-square rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))
            )}
            {category.images.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link href={`/image/${image.id}`}>
                  <Card className="overflow-hidden group cursor-pointer">
                    <div className="aspect-square relative bg-muted">
                      <Image
                        src={image.image_url}
                        alt={image.prompt}
                        fill
                        className="object-cover transition-all duration-300 group-hover:scale-105"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                          e.currentTarget.parentElement?.querySelector('.fallback')?.classList.remove('hidden')
                        }}
                      />
                      <div className="fallback hidden absolute inset-0 items-center justify-center p-6">
                        <div className="w-full h-full flex flex-col items-center justify-center text-center border-2 border-dashed border-muted-foreground/25 rounded-lg">
                          <ImageOff className="h-6 w-6 text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">Image unavailable</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      <p className="text-sm line-clamp-2 font-medium text-muted-foreground">
                        {toTitleCase(image.prompt)}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{image.user_email}</span>
                        <span>{formatDistanceToNow(new Date(image.created_at), { addSuffix: true })}</span>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          {category.hasMore && category.images.length >= ITEMS_PER_PAGE && (
            <div ref={ref} className="py-8 text-center">
              <Button
                variant="outline"
                onClick={() => handleViewMore(category.id)}
                disabled={loadingMore[category.id]}
              >
                {loadingMore[category.id] ? 'Loading...' : 'Load More'}
              </Button>
            </div>
          )}
        </section>
      ))}
    </div>
  )
} 