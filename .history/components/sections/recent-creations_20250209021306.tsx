import { recentGenerations } from '@/constants/generations'
import React from 'react'

function RecentCreations() {
  return (
   <section className="w-full bg-muted/50 py-16">
    <div className="px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-12">Recent Creations</h2>
      <div className="relative">
        {/* Fade Overlays */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-muted/50 to-transparent z-10" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-muted/50 to-transparent z-10" />
        
        {/* Auto-scrolling Container */}
        <div className="grid grid-cols-4 gap-4 h-[500px] overflow-hidden">
          {/* Column 1 */}
          <div className="animate-scroll space-y-4">
            {[...recentGenerations, ...recentGenerations].slice(0, 8).map((art, i) => (
              <div key={`${art.id}-${i}`} className="relative aspect-square w-full max-w-[200px]">
                <img
                  src={art.imageUrl}
                  alt={art.prompt}
                  className="object-cover w-full h-full rounded-md shadow-sm"
                />
              </div>
            ))}
          </div>
          
          {/* Column 2 */}
          <div className="animate-scroll-delayed space-y-4 pt-12">
            {[...recentGenerations, ...recentGenerations].slice(4, 12).map((art, i) => (
              <div key={`${art.id}-${i}`} className="relative aspect-square w-full max-w-[200px]">
                <img
                  src={art.imageUrl}
                  alt={art.prompt}
                  className="object-cover w-full h-full rounded-md shadow-sm"
                />
              </div>
            ))}
          </div>
          
          {/* Column 3 */}
          <div className="animate-scroll-more-delayed space-y-4 pt-24">
            {[...recentGenerations, ...recentGenerations].slice(2, 10).map((art, i) => (
              <div key={`${art.id}-${i}`} className="relative aspect-square w-full max-w-[200px]">
                <img
                  src={art.imageUrl}
                  alt={art.prompt}
                  className="object-cover w-full h-full rounded-md shadow-sm"
                />
              </div>
            ))}
          </div>

          {/* Column 4 */}
          <div className="animate-scroll-most-delayed space-y-4 pt-36">
            {[...recentGenerations, ...recentGenerations].slice(3, 11).map((art, i) => (
              <div key={`${art.id}-${i}`} className="relative aspect-square w-full max-w-[200px]">
                <img
                  src={art.imageUrl}
                  alt={art.prompt}
                  className="object-cover w-full h-full rounded-md shadow-sm"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
 
)
}

export default RecentCreations