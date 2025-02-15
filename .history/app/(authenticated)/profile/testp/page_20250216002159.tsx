"use client"

import { useState, useEffect } from "react"
import { useUser } from "@/hooks/use-user"
import { getUserImages } from "@/services/images"
import { Card } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import Image from "next/image"
import { ImageOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PaymentsHistory } from "../components/payments-history"
import CreditsLog from "../components/credits-log"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { createClient } from "@/utils/supabase/client"

const supabase = createClient()

interface UserImage {
  id: string
  image_url: string
  prompt: string
  created_at: string
}

const ITEMS_PER_PAGE = 12

export default function TestProfilePage() {
  console.log('🚀 TestProfilePage: Component mounted')
  
  const { user, loading: userLoading } = useUser()
  console.log('👤 User state from hook:', { user, loading: userLoading })
  
  const [images, setImages] = useState<UserImage[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Add direct Supabase auth check
  useEffect(() => {
    async function checkAuth() {
      const { data: { session }, error } = await supabase.auth.getSession()
      console.log('🔐 Direct Supabase Auth Check:', { 
        session: session?.user?.id,
        error,
        email: session?.user?.email 
      })
    }
    checkAuth()
  }, [])

  // Load images
  useEffect(() => {
    async function loadImages() {
      console.log('📥 loadImages called with:', {
        userId: user?.id,
        currentPage,
        ITEMS_PER_PAGE
      })

      if (!user?.id) {
        console.log('❌ No user ID available, skipping image load')
        return
      }

      console.log('🔄 Setting loading state to true')
      setLoading(true)
      
      try {
        console.log('🔍 Fetching images from Supabase...')
        const { data, error, count } = await getUserImages(user.id, currentPage, ITEMS_PER_PAGE)
        
        if (error) {
          console.error('❌ Error fetching images:', error)
          throw error
        }
        
        if (data) {
          console.log('✅ Images fetched successfully:', {
            imageCount: data.length,
            totalCount: count,
            firstImageId: data[0]?.id
          })
          setImages(data)
          const newTotalPages = Math.ceil((count || 0) / ITEMS_PER_PAGE)
          console.log('📄 Setting total pages:', newTotalPages)
          setTotalPages(newTotalPages)
        } else {
          console.log('⚠️ No data received from getUserImages')
        }
      } catch (error) {
        console.error('💥 Failed to load images:', error)
      } finally {
        console.log('🔄 Setting loading state to false')
        setLoading(false)
      }
    }

    console.log('⚡ useEffect triggered with:', {
      userId: user?.id,
      currentPage
    })
    loadImages()
  }, [user?.id, currentPage])

  // Loading state
  if (userLoading) {
    console.log('🔄 Showing user loading state')
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    )
  }

  // Not signed in state
  if (!user) {
    console.log('🚫 User not signed in')
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <h2 className="text-2xl font-bold mb-2">Please Sign In</h2>
        <p className="text-muted-foreground">
          You need to be signed in to view your profile
        </p>
      </div>
    )
  }

  console.log('🎨 Rendering profile page with:', {
    imagesCount: images.length,
    currentPage,
    totalPages,
    loading
  })

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Profile</h1>
        <p className="text-muted-foreground">{user.email}</p>
      </div>

      <Tabs defaultValue="creations" className="space-y-6">
        <TabsList>
          <TabsTrigger value="creations">Creations</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="credits">Generation Log</TabsTrigger>
        </TabsList>

        <TabsContent value="creations" className="space-y-6">
          {loading ? (
            // Loading skeletons
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
              {/* Images grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {images.map((image) => (
                  <Link key={image.id} href={`/image/${image.id}`}>
                    <Card className="overflow-hidden group cursor-pointer">
                      <div className="aspect-square relative bg-muted">
                        <Image
                          src={image.image_url}
                          alt={image.prompt}
                          fill
                          className="object-cover transition-all duration-300 group-hover:scale-105"
                          onError={(e) => {
                            console.error('🖼️ Image failed to load:', image.image_url)
                            e.currentTarget.style.display = 'none'
                            e.currentTarget.parentElement?.querySelector('.fallback')?.classList.remove('hidden')
                          }}
                        />
                        {/* Fallback for failed images */}
                        <div className="fallback hidden absolute inset-0 flex items-center justify-center">
                          <ImageOff className="h-6 w-6 text-muted-foreground" />
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-sm line-clamp-2 mb-2">{image.prompt}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(image.created_at), { addSuffix: true })}
                        </p>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => {
                      console.log('⬅️ Moving to previous page:', currentPage - 1)
                      setCurrentPage(p => Math.max(1, p - 1))
                    }}
                    disabled={currentPage === 1 || loading}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      console.log('➡️ Moving to next page:', currentPage + 1)
                      setCurrentPage(p => Math.min(totalPages, p + 1))
                    }}
                    disabled={currentPage === totalPages || loading}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          ) : (
            // Empty state
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