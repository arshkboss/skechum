'use client'

import { ImageCategory } from "@/app/types/image"
import { Button } from "@/components/ui/button"


interface CategoryFilterProps {
  selected?: ImageCategory
  onSelect: (category: ImageCategory | undefined) => void
}

const categories: ImageCategory[] = ['people', 'nature', 'technology', 'abstract', 'other']

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      <Button
        variant={selected === undefined ? "default" : "outline"}
        onClick={() => onSelect(undefined)}
      >
        All
      </Button>
      {categories.map((category) => (
        <Button
          key={category}
          variant={selected === category ? "default" : "outline"}
          onClick={() => onSelect(category)}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </Button>
      ))}
    </div>
  )
} 