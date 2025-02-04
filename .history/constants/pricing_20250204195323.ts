interface PricingPlan {
  credits: number
  price: number
  pricePerCredit: number
  features: readonly string[]
  originalPrice?: number
  isPopular?: boolean
}

export const pricingPlans: readonly PricingPlan[] = [
  {
    credits: 100,
    price: 8,
    pricePerCredit: 0.08,
    features: [
      "100 credits",
      "Commercial use",
      "SVG editor",
      "SVG, PNG, JPG export"
    ] as const
  },
  {
    credits: 200,
    price: 14,
    pricePerCredit: 0.07,
    features: [
      "200 credits",
      "Commercial use",
      "SVG editor",
      "SVG, PNG, JPG export"
    ] as const
  },
  {
    credits: 500,
    price: 24,
    pricePerCredit: 0.048,
    originalPrice: 30,
    isPopular: true,
    features: [
      "500 credits",
      "Commercial use",
      "SVG editor",
      "SVG, PNG, JPG export"
    ] as const
  }
] as const 