"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import AuthButton from "@/components/header-auth"
import { CreditCard } from "lucide-react"
import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { ThemeToggle } from "./theme-toggle"
import { UserNav } from "./user-nav"

/**
 * Navbar component with theme switcher
 * Provides navigation and theme switching functionality
 */
export default async function Navbar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ">
      <div className="container flex h-14 items-center justify-center px-4 w-full mx-auto">
        {/* Logo/Brand */}
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">Skechum</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center space-x-6 ml-6">
          <Link
            href="/explore"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              usePathname() === "/explore"
                ? "text-foreground"
                : "text-foreground/60"
            )}
          >
            Explore
          </Link>
          <Link
            href="/create"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              usePathname() === "/create"
                ? "text-foreground"
                : "text-foreground/60"
            )}
          >
            Create
          </Link>
          <Link
            href="/pricing"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              usePathname() === "/pricing"
                ? "text-foreground"
                : "text-foreground/60"
            )}
          >
            Pricing
          </Link>
        </nav>

        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          {user ? (
            <UserNav 
              user={{
                name: user.user_metadata.display_name || user.email,
                email: user.email,
                image: user.user_metadata.avatar_url,
                profileUrl: `/${user.id}`
              }} 
            />
          ) : (
            <div className="flex gap-4">
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
} 