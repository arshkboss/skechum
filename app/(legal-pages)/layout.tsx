import { Separator } from "@/components/ui/separator"

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container relative max-w-3xl py-12 md:py-20">
      {children}
      <Separator className="my-12" />
      <footer className="text-sm text-muted-foreground text-center pb-8">
        © {new Date().getFullYear()} Skechum. All rights reserved.
      </footer>
    </div>
  )
} 