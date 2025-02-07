"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import AuthButton from "@/components/header-auth"
import { CreditCard } from "lucide-react"
import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"

/**
 * Navbar component with theme switcher
 * Provides navigation and theme switching functionality
 */
export default function Navbar({ user }: { user: any }) {
  const [credits, setCredits] = useState<number | null>(null);
  const pathname = usePathname()
  const supabase = createClient();

  useEffect(() => {
    async function fetchCredits() {
      if (user?.id) {
        const { data, error } = await supabase
          .from('user_credits')
          .select('credits')
          .eq('user_id', user.id)
          .single();
        
        if (error) {
          console.error('Error fetching credits:', error);
          return;
        }
        
        if (data) {
          setCredits(data.credits);
        }
      }
    }

    fetchCredits();
  }, [user?.id]);

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

        <div className="ml-auto flex items-center space-x-4">
          {user && (
            <Link href="/pricing">
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-2 bg-accent/5 dark:bg-accent/50 hover:bg-accent/10 rounded-full"
              >
                <CreditCard className="h-4 w-4" />
                <span>{credits !== null ? `${credits} credits` : '...'}</span>
              </Button>
            </Link>
          )}
          <AuthButton user={user} />
        </div>
      </div>
    </header>
  )
} 