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

export default function AuthButton({ user }: { user: any }) {
  const fullName = user?.identities?.[0]?.identity_data?.full_name.split(" ")[0] || user?.email;
  const avatar = user?.identities?.[0]?.identity_data?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + fullName;
  useTheme();

  return user ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative h-10 w-auto gap-2 pl-2 pr-4 rounded-full hover:bg-accent group 
            border hover:border-border transition-all duration-200
            bg-accent/5 dark:bg-accent/50 md:w-auto w-full justify-between"
        >
          <div className="flex items-center gap-2 w-full">
            <Image 
              src={avatar} 
              alt={fullName} 
              width={32} 
              height={32} 
              className="rounded-full ring-2 ring-offset-2 ring-offset-background ring-border/30" 
            />
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
          <DropdownMenuItem className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4 shrink-0" />
            <span>Settings</span>
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
        variant="outline" 
        className="rounded-full w-full md:w-auto"
      >
        <Link href="/sign-in">Sign in</Link>
      </Button>
      <Button 
        asChild 
        size="sm" 
        variant="default" 
        className="rounded-full w-full md:w-auto"
      >
        <Link href="/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}

