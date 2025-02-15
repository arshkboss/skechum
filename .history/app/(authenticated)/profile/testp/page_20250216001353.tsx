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

interface UserImage {
  id: string
  image_url: string
  prompt: string
  created_at: string
}

const ITEMS_PER_PAGE = 12

export default function TestProfilePage() {
  const { user, loading: userLoading } = useUser()
  const [images, setImages] = useState<UserImage[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Load images
  useEffect(() => {
    async function loadImages() {
      if (!user?.id) return

      setLoading(true)
      try {
        const { data, error, count } = await getUserImages(user.id, currentPage, ITEMS_PER_PAGE)
        if (error) throw error
        
        if (data) {
          setImages(data)
          setTotalPages(Math.ceil((count || 0) / ITEMS_PER_PAGE))
        }
      } catch (error) {
        console.error('Failed to load images:', error)
      } finally {
        setLoading(false)
      }
    }

    loadImages()
  }, [user?.id, currentPage])

  // Loading state
  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    )
  }

  // Not signed in state
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
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1 || loading}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
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