import React from 'react'
import { FeatureGrid } from '../feature-grid'

function StylesSection() {
  return (
    <section className="w-full bg-muted/50 py-24">
        <div className="px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold">Available Styles</h2>
            <p className="text-muted-foreground">
              Choose from our collection of carefully crafted AI art styles
            </p>
          </div>
          
          <FeatureGrid />
        </div>
      </section>
  )
}

export default StylesSection