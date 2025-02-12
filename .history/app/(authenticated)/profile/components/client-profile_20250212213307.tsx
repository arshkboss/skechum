"use client"

// Move all the client-side logic here
export function ClientProfilePage({
  initialImages,
  initialPage,
  totalPages,
  itemsPerPage
}: {
  initialImages: UserImage[]
  initialPage: number
  totalPages: number
  itemsPerPage: number
}) {
  const [images, setImages] = useState(initialImages)
  const [currentPage, setCurrentPage] = useState(initialPage)
  const router = useRouter()

  // Handle page changes
  const handlePageChange = (newPage: number) => {
    scrollToTop()
    router.push(`/profile?page=${newPage}`)
  }

  // Rest of your existing client-side code...
  return (
    <div className="container mx-auto p-8">
      {/* Your existing JSX */}
    </div>
  )
} 