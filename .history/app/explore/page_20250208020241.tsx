'use client'

import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { useDebounce } from '@/hooks/use-debounce'
import { ImageGrid } from '@/components/image-grid'
import { SearchInput } from '@/components/search-input'
import { CategoryFilter } from '@/components/category-filter'
import { StorageImage, ImageCategory } from '@/types/image'
import { imageUtils } from '@/utils/image-utils'
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import type { ChangeEvent } from 'react'

export default function ExplorePage() {
  const [images, setImages] = useState<StorageImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<ImageCategory | undefined>()
  
  const debouncedSearch = useDebounce(searchQuery, 500)
  
  const { ref, inView } = useInView({
    threshold: 0,
  })

  // Load initial images
  useEffect(() => {
    loadImages(true)
  }, [debouncedSearch, selectedCategory])

  // Handle infinite scroll
  useEffect(() => {
    if (inView && !loading && hasMore) {
      setPage(prev => prev + 1)
      loadImages(false)
    }
  }, [inView])

  const loadImages = async (reset: boolean) => {
    try {
      setLoading(true)
      setError(null)
      
      const currentPage = reset ? 1 : page
      const { data, count } = await imageUtils.fetchImages({
        category: selectedCategory,
        query: debouncedSearch,
        page: currentPage
      })
      
      setImages(prev => reset ? data : [...prev, ...data])
      setHasMore(currentPage * 20 < count)
      
    } catch (err) {
      console.error('Error loading images:', err)
      setError('Failed to load images. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold">Explore Images</h1>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <SearchInput
            value={searchQuery}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            placeholder="Search images..."
            className="flex-1"
          />
          
          <CategoryFilter
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>
      </div>

      {error && (
        <div className="text-red-500 mb-4">
          {error}
        </div>
      )}

      <ImageGrid images={images} />
      
      {loading && (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      )}
      
      <div ref={ref} className="h-10" />
    </div>
  )
} 