interface PricingPlan {
  credits: number
  price: number
  pricePerCredit: number
  features: readonly string[]
  originalPrice?: number
  isPopular?: boolean
  image: string
}


export const pricingPlans: readonly PricingPlan[] = [
  {
    credits: 100,
    price: 8,
    pricePerCredit: 0.08,
    image: "/pricing-images/100.svg",
    features: [
      "100 credits",
      "Commercial use",
      "SVG editor",
      "SVG, PNG, JPG export"
    ] as const
  },
  {
    credits: 500,
    price: 14,
    pricePerCredit: 0.07,
    image: "/pricing-images/500.svg",
    features: [
      "500 credits",
      "Commercial use",


      "SVG editor",
      "SVG, PNG, JPG export"
    ] as const
  },
  {
    credits: 1000,
    price: 24,
    pricePerCredit: 0.048,
    originalPrice: 30,
    isPopular: true,
    image: "/pricing-images/1000.svg",
    features: [
      "1000 credits",
      "Commercial use",
      "SVG editor",
      "SVG, PNG, JPG export"
    ] as const

  }
] as const 