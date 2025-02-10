import { Metadata } from "next"

export const metadata: Metadata = {
  title: "About",
  description: "Learn about our mission to make AI art creation accessible to everyone",
  openGraph: {
    title: "About Skechum",
    description: "Learn about our mission to make AI art creation accessible to everyone",
    images: [
      {
        url: "/about-og.png",
        width: 1200,
        height: 630,
        alt: "About Skechum",
      },
    ],
  },
  twitter: {
    title: "About Skechum",
    description: "Learn about our mission to make AI art creation accessible to everyone",
    images: ["/about-og.png"],
  },
} 