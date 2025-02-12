"use client"

import { signOutAction } from "@/app/actions";
import Link from "next/link";
import { Button } from "./ui/button";
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

  return user ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative h-10 w-auto gap-2 pl-2 pr-4 rounded-full hover:bg-accent group 
            border hover:border-border transition-all duration-200
            bg-accent/5 dark:bg-accent/50 md:w-auto  justify-between"
        >
          <div className="flex items-center gap-2 w-full">
            <Avatar className="h-8 w-8 ring-2 ring-offset-2 ring-offset-background ring-border/30">
              <AvatarImage src={avatar} />
              <AvatarFallback>
                {user.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="line-clamp-1">{fullName}</span>
            <ChevronDown className="h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity ml-auto" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-56 mt-2" 
        align="end" 
        forceMount
        sideOffset={8}
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none line-clamp-1">{fullName}</p>
            <p className="text-xs leading-none text-muted-foreground line-clamp-1">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/profile" className="w-full cursor-pointer">
              <User className="mr-2 h-4 w-4 shrink-0" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
         
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem 
            onSelect={(e) => e.preventDefault()}
            className="cursor-pointer"
          >
            <Palette className="mr-2 h-4 w-4 shrink-0" />
            <span className="flex-1">Theme</span>
            <div className="ml-2">
              <ThemeToggle />
            </div>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <form action={signOutAction}>
          <DropdownMenuItem 
            asChild
            className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 cursor-pointer"
          >
            <button type="submit" className="w-full flex items-center">
              <LogOut className="mr-2 h-4 w-4 shrink-0" />
              <span>Sign out</span>
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <div className="flex gap-2 w-full md:w-auto">
      <Button 
        asChild 
        size="sm" 
        className="rounded-full w-full md:w-auto"
      >
        <Link href="/sign-in">Sign in</Link>
      </Button>
    </div>
  );
}

