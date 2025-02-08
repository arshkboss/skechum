"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import AuthButton from "@/components/header-auth"
import { Wallet, Menu, X } from "lucide-react"
import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet"
import { VisuallyHidden } from "@/components/ui/visually-hidden"

/**
 * Navbar component with theme switcher
 * Provides navigation and theme switching functionality
 */
export default function Navbar({ user }: { user: any }) {
  const [credits, setCredits] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname()
  const supabase = createClient();
  const [open, setOpen] = useState(false)

  useEffect(() => {
    async function fetchCredits() {
      if (user?.id) {
        try {
          const response = await fetch('/api/credits')
          if (!response.ok) throw new Error('Failed to fetch credits')
          const data = await response.json()
          setCredits(data.credits)
        } catch (error) {
          console.error('Error fetching credits:', error)
        }
      }
    }

    fetchCredits()
  }, [user?.id])

  const routes = [
    {
      href: "/create",
      label: "Create",
    },
    {
      href: "/explore",
      label: "Explore",
    },
    
    {
      href: "/pricing",
      label: "Pricing",
    },
    {
      href: "/about",
      label: "About",
    },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4 w-full mx-auto relative">
        {/* Logo/Brand */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold">Skechum</span>
          </Link>
        </div>

        {/* Desktop Navigation - Centered */}
        <nav className="hidden md:flex items-center space-x-6 absolute left-1/2 -translate-x-1/2">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === route.href
                  ? "text-foreground"
                  : "text-foreground/60"
              )}
            >
              {route.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth & Credits */}
        <div className="hidden md:flex items-center space-x-4">
          {user && (
            <Link href="/pricing">
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-2 bg-accent/5 dark:bg-accent/50 hover:bg-accent/10 rounded-full"
              >
                <Wallet className="h-4 w-4" />
                <span>{credits !== null ? `${credits} credits` : '...'}</span>
              </Button>
            </Link>
          )}
          <AuthButton user={user} />
        </div>

        {/* Mobile Menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <SheetTitle asChild>
              <VisuallyHidden>Navigation Menu</VisuallyHidden>
            </SheetTitle>
            <nav className="flex flex-col space-y-4 mt-6">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary p-2",
                    pathname === route.href
                      ? "text-foreground bg-accent/50 rounded-md"
                      : "text-foreground/60"
                  )}
                >
                  {route.label}
                </Link>
              ))}
              <div className="border-t pt-4 mt-4">
                {user && (
                  <Link href="/pricing" className="block mb-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full flex items-center gap-2 bg-accent/5 dark:bg-accent/50 hover:bg-accent/10 rounded-full"
                    >
                      <CreditCard className="h-4 w-4" />
                      <span>{credits !== null ? `${credits} credits` : '...'}</span>
                    </Button>
                  </Link>
                )}
                <div className="flex flex-col space-y-2">
                  <AuthButton user={user} />
                </div>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
} 