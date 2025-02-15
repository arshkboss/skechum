"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import AuthButton from "@/components/header-auth"
import { Wallet, Menu, X, LogOut } from "lucide-react"
import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet"
import { useTheme } from "next-themes"
import { VisuallyHidden } from "@/components/ui/visually-hidden"
import { useUser } from "@/hooks/use-user"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

/**
 * Navbar component with theme switcher
 * Provides navigation and theme switching functionality
 */
export default function Navbar({ user }: { user: any }) {
  const { credits } = useUser()
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const supabase = createClient()
  const [open, setOpen] = useState(false)
  const { theme, setTheme } = useTheme()

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

  const handleThemeChange = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 w-full mx-auto relative">
        {/* Logo/Brand */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-semibold text-lg">Skechum</span>
          </Link>
        </div>

        {/* Desktop Navigation - Centered */}
        <nav className="hidden md:flex items-center space-x-8 absolute left-1/2 -translate-x-1/2">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === route.href
                  ? "text-foreground font-semibold"
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
                className="flex items-center gap-2 bg-background border-border hover:bg-accent/10 rounded-full px-4"
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
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] p-0">
            <SheetTitle asChild>
              <VisuallyHidden>Navigation Menu</VisuallyHidden>
            </SheetTitle>
            
            <div className="flex flex-col h-full">
              {/* Profile Card for Mobile */}
              {user && (
                <div className="p-6 border-b">
                  <div className="flex items-center space-x-4 mb-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.user_metadata?.avatar_url} />
                      <AvatarFallback>
                        {user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium">
                        {user.user_metadata?.full_name?.split(' ')[0] || user.email}
                      </h4>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                    
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <Link 
                        href="/profile" 
                        onClick={closeMenu}
                        className="flex items-center justify-center text-sm h-9 rounded-md border bg-background hover:bg-accent/10 transition-colors"
                      >
                        Profile
                      </Link>
                      <Link href="/pricing" onClick={closeMenu}>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="w-full flex items-center justify-center gap-2 bg-background border-border hover:bg-accent/10 h-9"
                        >
                          <Wallet className="h-4 w-4" />
                          <span>{credits !== null ? credits : '...'}</span>
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Links */}
              <nav className="flex-1 p-6">
                <div className="space-y-1">
                  {routes.map((route) => (
                    <Link
                      key={route.href}
                      href={route.href}
                      onClick={closeMenu}
                      className={cn(
                        "flex items-center w-full h-10 text-sm font-medium transition-colors rounded-md px-4",
                        pathname === route.href
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                      )}
                    >
                      {route.label}
                    </Link>
                  ))}
                </div>
              </nav>

              {/* Footer Actions */}
              <div className="mt-auto p-6 border-t space-y-4">
                {user ? (
                  <Button 
                    variant="ghost" 
                    className="w-full text-sm text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 dark:hover:bg-red-950/50 h-10 flex items-center justify-center gap-2"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </Button>
                ) : (
                  <AuthButton user={user} />
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
} 