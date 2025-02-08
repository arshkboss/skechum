import { recentGenerations } from '@/constants/generations'
import React from 'react'

function RecentCreations() {
  return (
    <section className="w-full bg-muted/50 py-16">
      <div className="px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Recent Creations</h2>
        <div className="relative scroll-pause">
          {/* Fade Overlays */}
          <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-muted/50 to-transparent z-10" />
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-muted/50 to-transparent z-10" />
          
          {/* Auto-scrolling Container */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 h-[500px] overflow-hidden">
            {/* Column 1 */}
            <div className="space-y-2 flex flex-col items-center">
              <div className="animate-scroll">
                {[...recentGenerations, ...recentGenerations].map((art, i) => (
                  <div 
                    key={`${art.id}-${i}`} 
                    className="relative aspect-square w-full max-w-[200px] mb-6 shadow-md rounded-md"
                  >
                    <img
                      src={art.imageUrl}
                      alt={art.prompt}
                      className="object-cover w-full h-full rounded-md shadow-sm"
                    />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Column 2 */}
            <div className="space-y-2">
              <div className="animate-scroll-delayed">
                {[...recentGenerations, ...recentGenerations].map((art, i) => (
                  <div 
                    key={`${art.id}-${i}`} 
                    className="relative aspect-square w-full max-w-[200px] mb-6"
                  >
                    <img
                      src={art.imageUrl}
                      alt={art.prompt}
                      className="object-cover w-full h-full rounded-md shadow-sm"
                    />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Column 3 - Hide on mobile */}
            <div className="hidden md:block space-y-2">
              <div className="animate-scroll-more-delayed">
                {[...recentGenerations, ...recentGenerations].map((art, i) => (
                  <div 
                    key={`${art.id}-${i}`} 
                    className="relative aspect-square w-full max-w-[200px] mb-6"
                  >
                    <img
                      src={art.imageUrl}

                      alt={art.prompt}
                      className="object-cover w-full h-full rounded-md shadow-sm"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Column 4 - Hide on mobile */}
            <div className="hidden md:block space-y-2">
              <div className="animate-scroll-most-delayed">
                {[...recentGenerations, ...recentGenerations].map((art, i) => (
                  <div 
                    key={`${art.id}-${i}`} 
                    className="relative aspect-square w-full max-w-[200px] mb-6"
                  >
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
      </div>
    </section>
  )
}

export default RecentCreations