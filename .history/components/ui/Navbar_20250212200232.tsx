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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"

// Define the custom event type
interface CreditsUpdateEvent extends CustomEvent {
  detail: { credits: number }
}

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

    // Listen for credits updates with proper typing
    const handleCreditsUpdate = (event: Event) => {
      const customEvent = event as CreditsUpdateEvent
      setCredits(customEvent.detail.credits)
    }

    // Add event listener
    window.addEventListener('creditsUpdated', handleCreditsUpdate)
    
    fetchCredits()

    // Cleanup
    return () => {
      window.removeEventListener('creditsUpdated', handleCreditsUpdate)
    }
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

  // Add closeMenu helper function
  const closeMenu = () => {
    setOpen(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    closeMenu();
  };

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
            <div className="flex flex-col space-y-6 pt-6">
              {/* Profile Card for Mobile */}
              {user && (
                <Card className="border rounded-lg">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4 mb-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user.user_metadata?.avatar_url} />
                        <AvatarFallback>
                          {user.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <h4 className="text-sm font-semibold">
                          {user.user_metadata?.full_name || user.email}
                        </h4>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Link href="/pricing" onClick={closeMenu} className="block">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="w-full flex items-center gap-2 bg-accent/5 dark:bg-accent/50 hover:bg-accent/10 rounded-full"
                        >
                          <Wallet className="h-4 w-4" />
                          <span>{credits !== null ? `${credits} credits` : '...'}</span>
                        </Button>
                      </Link>

                      <div className="grid grid-cols-2 gap-2">
                        <Link 
                          href="/profile" 
                          onClick={closeMenu}
                          className="text-sm px-3 py-2 rounded-md hover:bg-accent text-center"
                        >
                          Profile
                        </Link>
                        <Link 
                          href="/settings" 
                          onClick={closeMenu}
                          className="text-sm px-3 py-2 rounded-md hover:bg-accent text-center"
                        >
                          Settings
                        </Link>
                      </div>

                      <Button 
                        variant="ghost" 
                        className="w-full text-sm text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                        onClick={handleSignOut}
                      >
                        Sign out
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Navigation Links */}
              <nav className="flex flex-col space-y-1">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    onClick={closeMenu}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary p-3 rounded-md",
                      pathname === route.href
                        ? "bg-accent/50 text-foreground"
                        : "text-foreground/60 hover:bg-accent/30"
                    )}
                  >
                    {route.label}
                  </Link>
                ))}
              </nav>

              {/* Show AuthButton only for non-authenticated users */}
              {!user && (
                <div className="pt-4 mt-auto">
                  <AuthButton user={user} />
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
} 