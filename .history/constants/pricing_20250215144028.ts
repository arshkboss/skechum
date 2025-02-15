export interface PricingPlan {
  credits: number
  price: number
  pricePerCredit: number
  features: readonly string[]
  originalPrice?: number
  isPopular?: boolean
  image: string
  imageAlt: string
  productId: string
  name: string
  description: string
}

export const pricingPlans: readonly PricingPlan[] = [
 
  { name: 'Starter Pack',
    credits: 150,
    price: 8,
    pricePerCredit: 0.053,
    image: "/pricing-card/150.svg",
    imageAlt: "150 credits",
    productId: "pdt_euU2AfE7iRo3EFQtAkcBm",
    features: [
      "150 credits",
      "Commercial use",
      "PNG, JPG, SVG export"
    ] as const
  },
  {name: 'Starter Pack',
    credits: 400,
    price: 14,
    pricePerCredit: 0.035,
    image: "/pricing-card/400.svg",
    imageAlt: "400 credits",
    productId: "pdt_7nAbtLg8GSVlIVIhM8URQ",
    features: [
      "400 credits",
      "Commercial use",
      "PNG, JPG, SVG export"
    ] as const
  },
  {
    name: 'Starter Pack',
    credits: 800,
    price: 24,
    pricePerCredit: 0.03,
    originalPrice: 30,
    isPopular: true,
    image: "/pricing-card/800.svg",
    imageAlt: "800 credits",
    productId: "pdt_QXOV1j8asoIAd8JcgekHs",
    features: [
      "800 credits",
      "Commercial use",
      "SVG, PNG, JPG export"
    ] as const
  }
] as const 