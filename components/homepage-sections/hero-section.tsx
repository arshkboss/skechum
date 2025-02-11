import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'
import { ArrowRight } from 'lucide-react'

function HeroSection() {
  return (
    <section className="w-full px-4 md:px-6 lg:px-8 py-24">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl py-12" >
              Transform Your Ideas Into
              <span className="text-primary"> Beautiful Art</span>
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl pb-8">
              Create stunning illustrations in seconds using advanced AI. Choose your style and watch your imagination come to life.
            </p>
            <div className="flex justify-center gap-4 py-8">
              <Link href="/create">
                <Button size="lg" className="rounded-full">
                  Create Now for Free
                  <ArrowRight className="ml-2 h-4 w-4 animate-pulse" />
                </Button>
              </Link>
              <Link href="/explore">
                <Button variant="outline" size="lg" className="rounded-full">
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