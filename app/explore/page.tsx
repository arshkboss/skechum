import { ImageIcon } from "lucide-react"

export default function GalleryPage() {
  return (
    <div className="container py-6">
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold">Gallery</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Browse through AI-generated artwork
          </p>
        </div>

        {/* Placeholder for gallery grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-lg border bg-muted/50 flex items-center justify-center"
            >
              <ImageIcon className="h-10 w-10 text-muted-foreground" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 