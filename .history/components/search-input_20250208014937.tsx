'use client'

import { Input } from "@/components/ui/input"
import { ChangeEvent } from "react"

interface SearchInputProps {
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  className?: string
}

export function SearchInput({ value, onChange, placeholder, className }: SearchInputProps) {
  return (
    <Input
      type="search"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={className}
    />
  )
} 