import DeployButton from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";
import { Footer } from "@/components/footer";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Skechum | Hand-drawn sketch style illustrations with AI",
  description: "Sketchum is a platform for creating beautiful hand-drawn sketch style illustrations with AI",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col items-center w-full mx-auto">
           <nav className="  w-full flex justify-between items-center border-b border-b-foreground/10 h-16 px-4">
            <div className="max-w-7xl w-full flex justify-between items-center border-b border-b-foreground/10 h-16 px-4">
              <Link href="/">Skechum</Link>
            </div>
            <div>
              <HeaderAuth />
            </div>
           </nav>
              <div>
                {children}
              </div>

              
            
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
