"use client"

import { signOutAction } from "@/app/actions";
import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, User, Palette, ChevronDown } from "lucide-react";
import ThemeToggle from "./ui/theme-toggle";
import { useTheme } from "next-themes";
import { User as SupabaseUser } from '@supabase/supabase-js'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createClient } from "@/utils/supabase/client"

interface AuthButtonProps {
  user: SupabaseUser | null
}

export default function AuthButton({ user }: AuthButtonProps) {
  const supabase = createClient()

  const getUserDisplayName = () => {
    if (!user) return ''
    
    const identityData = user.identities?.[0]?.identity_data
    if (typeof identityData?.full_name === 'string') {
      return identityData.full_name.split(' ')[0]
    }
    
    return user.email || ''
  }

  const getAvatarUrl = () => {
    if (!user) return ''
    
    const avatarUrl = user.identities?.[0]?.identity_data?.avatar_url
    if (typeof avatarUrl === 'string') {
      return avatarUrl
    }
    
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${getUserDisplayName()}`
  }

  const fullName = getUserDisplayName()
  const avatar = getAvatarUrl()

  useTheme();

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return user ? (
    <div className="flex items-center gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.user_metadata?.avatar_url} />
              <AvatarFallback>
                {user.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href="/profile" className="cursor-pointer">
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={signOut}>
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ) : (
    <Link href="/login">
      <Button variant="default" size="sm">
        Sign In
      </Button>
    </Link>
  )
}

