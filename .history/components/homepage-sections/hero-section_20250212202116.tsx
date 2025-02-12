'use client'

import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'
import { ArrowRight } from 'lucide-react'

function HeroSection() {
  return (
    <section className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-12 md:py-24">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-2xl sm:text-2xl font-bold tracking-tighter md:text-5xl lg:text-6xl py-6 md:py-12 px-2">
            Transform Your Ideas Into
            <span className="text-primary block sm:inline"> Beautiful Art</span>
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground text-sm sm:text-base md:text-xl px-3 pb-6 md:pb-8">
            Create stunning illustrations in seconds using advanced AI. Choose your style and watch your imagination come to life.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 py-4 md:py-8 px-4">
            <Link href="/create" className="w-full sm:w-auto">
              <Button size="lg" className="rounded-full w-full sm:w-auto">
                Create Now for Free
                <ArrowRight className="ml-2 h-4 w-4 animate-pulse" />
              </Button>
            </Link>
            <Link href="/explore" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="rounded-full w-full sm:w-auto">
                View Gallery
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection