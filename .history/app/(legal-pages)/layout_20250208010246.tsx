import { Separator } from "@/components/ui/separator"

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Background */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-gray-950">
        <div className="absolute h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      <div className="container relative max-w-4xl py-12 md:py-20">
        <div className="prose dark:prose-invert max-w-none">
          {children}
        </div>
        <Separator className="my-12" />
        <footer className="text-sm text-muted-foreground text-center pb-8">
          © {new Date().getFullYear()} Skechum. All rights reserved.
        </footer>
      </div>
    </>
  )
} 