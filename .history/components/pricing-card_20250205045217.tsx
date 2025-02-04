"use client"

import { Check } from "lucide-react"
import { Card } from "./ui/card"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"
import Image from "next/image"
interface PricingCardProps {
  credits: number
  price: number
  pricePerCredit: number
  features: readonly string[]
  originalPrice?: number
  isPopular?: boolean
  image: string
  imageAlt: string
}



export function PricingCard({ 
  credits, 
  price, 
  pricePerCredit, 
  originalPrice, 
  isPopular,
  image,
  features 

}: PricingCardProps) {
  return (
    <Card className={cn(
      "flex flex-col p-6",
      isPopular && "border-2 border-primary relative"
    )}>
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary px-3 py-1 rounded-full">
          <span className="text-xs font-medium text-primary-foreground">Limited Time Offer</span>
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2">{credits} credits</h3>
        <div className="relative inline-block">
          <span className="text-4xl font-bold">${price}</span>
          {originalPrice && (
            <span className="text-xl text-muted-foreground line-through ml-2">
              ${originalPrice}
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          ${pricePerCredit} per credit
        </p>
      </div>
      <div className="flex justify-center py-4">
        <Image 
        src={image}
        alt={"image"}
        width={100}
        height={100}
        className="rounded-full"



        />
        </div>
      <Button 
        className="w-full mb-6" 

        variant={isPopular ? "default" : "outline"}
      >
        Buy credits
      </Button>

      <ul className="space-y-3">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2 text-sm">
            <Check className="h-4 w-4 text-primary flex-shrink-0" />
            {feature}
          </li>
        ))}
      </ul>
    </Card>
  )
} 