"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import NProgress from "nprogress"

NProgress.configure({
  minimum: 0.3,
  easing: 'ease',
  speed: 500,
  showSpinner: false,
})

export function LoadingBar() {
  const router = useRouter()

  useEffect(() => {
    const handleStart = () => {
      NProgress.start()
    }

    const handleStop = () => {
      NProgress.done()
    }

    // Add event listeners for navigation
    document.addEventListener('beforeunload', handleStart)
    document.addEventListener('DOMContentLoaded', handleStop)

    // Listen for client-side navigation
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const anchor = target.closest('a')
      
      if (anchor && anchor.href && !anchor.target && anchor.origin === window.location.origin) {
        handleStart()
      }
    }

    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('beforeunload', handleStart)
      document.removeEventListener('DOMContentLoaded', handleStop)
      document.removeEventListener('click', handleClick)
      NProgress.remove()
    }
  }, [])

  return null
} 