interface PricingPlan {
  credits: number
  price: number
  pricePerCredit: number
  features: readonly string[]
  originalPrice?: number
  isPopular?: boolean
  image: string
  imageAlt: string
}



export const pricingPlans: readonly PricingPlan[] = [
  {
    credits: 150,
    price: 8,
    pricePerCredit: 0.04,
    image: "/pricing-card/100.svg",
    imageAlt: "150 credits",


    features: [
      "150 credits",
      "Commercial use",
      "PNG, JPG, SVG export"
    ] as const


  },

  {
    credits: 500,
    price: 14,
    pricePerCredit: 0.07,
    image: "/pricing-card/500.svg",
    imageAlt: "500 credits",

    features: [
      "500 credits",
      "Commercial use",
      "PNG, JPG export"
    ] as const
  },
  {
    credits: 1000,
    price: 24,
    pricePerCredit: 0.048,
    originalPrice: 30,
    isPopular: true,
    image: "/pricing-card/1000.svg",
    imageAlt: "1000 credits",
    features: [
      "1000 credits",
      "Commercial use",
      "SVG, PNG, JPG export"
    ] as const

  }
] as const 