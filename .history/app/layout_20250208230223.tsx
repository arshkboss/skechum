import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Footer } from "@/components/footer";
import Navbar from "@/components/ui/Navbar";
import { createClient } from "@/utils/supabase/server";
import { Metadata } from 'next'
import { LoadingBar } from "@/components/ui/loading-bar"
import "@/styles/nprogress.css"
import { Analytics } from "@vercel/analytics/react"
const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL('https://skechum.com'),
  title: {
    template: '%s | Skechum',
    default: 'Skechum - AI Art Creation Platform', // Used for the root page
  },
  description: 'Transform your ideas into beautiful artwork using AI technology',
  keywords: ['AI art', 'digital art', 'art generation', 'AI image generation', 'creative tools'],
  authors: [{ name: 'Skechum Team' }],
  creator: 'Skechum',
  publisher: 'Skechum',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'Skechum',
    title: {
      template: '%s | Skechum',
      default: 'Skechum - AI Art Creation Platform',
    },
    description: 'Transform your ideas into beautiful artwork using AI technology',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Skechum - AI Art Creation Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: {
      template: '%s | Skechum',
      default: 'Skechum - AI Art Creation Platform',
    },
    description: 'Transform your ideas into beautiful artwork using AI technology',
    creator: '@skechum',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png' },
      { url: '/apple-icon-dark.png', media: '(prefers-color-scheme: dark)' },
    ],
  },
  manifest: '/manifest.json',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export const revalidate = 3600 // revalidate every hour

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LoadingBar />
          <main className="min-h-screen flex flex-col">
            <Navbar user={user} />
            {children}
          </main>
          <Footer />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
