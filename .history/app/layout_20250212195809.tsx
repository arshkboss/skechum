import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Footer } from "@/components/footer";
import Navbar from "@/components/ui/Navbar";
import { createClient } from "@/utils/supabase/server";
import { Metadata } from 'next'

import "@/styles/nprogress.css"

import { Analytics } from "@vercel/analytics/react"
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "@/components/ui/toaster"
import { SpeedInsights } from "@vercel/speed-insights/next"


export const metadata: Metadata = {
  metadataBase: new URL('https://skechum.com'),
  title: {
    template: '%s | Skechum',
    default: 'Skechum - AI Illustration Art Creation Platform', // Used for the root page
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
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="AI Illustration Art Creation Platform" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />

        {/* Google Analytics */}
     
<script async src="https://www.googletagmanager.com/gtag/js?id=G-8YZVZX1Z4C"></script>
<script>{`
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-8YZVZX1Z4C');`}
</script>
      </head>
      <body className="bg-background text-foreground overflow-x-hidden">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          
          
        ><NextTopLoader color="#D63418FF" showSpinner={false} />
          
          <main className="min-h-screen flex flex-col">
            <Navbar user={user} />
            {children}
          </main>
          <Footer />
        </ThemeProvider>
        <SpeedInsights />
        <Analytics />
        <Toaster />
      </body>
    </html>
  );
}
