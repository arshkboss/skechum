"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import AuthButton from "@/components/header-auth"

/**
 * Navbar component with theme switcher
 * Provides navigation and theme switching functionality
 */
export default function Navbar({ user }: { user: any }) {
  const { setTheme } = useTheme()
  const pathname = usePathname()

  const routes = [
    {
      href: "/create",
      label: "Create Illustations",
    },
    {
      href: "/explore",
      label: "Explore Gallery",
    },
  ]

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

        {/* Theme Switcher */}
        <div>
          <AuthButton user={user} />
        </div>
      </div>
    </header>
  )
} 