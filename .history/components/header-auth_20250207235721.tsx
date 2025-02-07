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
import { CreditCard, LogOut, Settings, User, Palette } from "lucide-react";
import ThemeToggle from "./ui/theme-toggle";
import { useTheme } from "next-themes";

export default function AuthButton({ user }: { user: any }) {
  const fullName = user?.identities?.[0]?.identity_data?.full_name.split(" ")[0] || user?.email;
  const avatar = user?.identities?.[0]?.identity_data?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + fullName;
  const { theme, setTheme } = useTheme();

  return user ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative h-10 w-auto gap-2 pl-2 pr-4 rounded-full hover:bg-accent"
        >
          <Image 
            src={avatar} 
            alt={fullName} 
            width={32} 
            height={32} 
            className="rounded-full" 
          />
          <span>Hey, {fullName}!</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>0 credits</span>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/profile">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <Palette className="mr-2 h-4 w-4" />
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
            className="text-red-600 dark:text-red-400"
          >
            <button type="submit" className="w-full flex items-center">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant="outline">
        <Link href="/sign-in">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant="default">
        <Link href="/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}

