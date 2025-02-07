import { Separator } from "@/components/ui/separator"

export default function LegalLayout({
  children,

}: {
  children: React.ReactNode
}) {
  return (
    <div className="container max-w-4xl py-6 md:py-12">
      <div className="space-y-6">
        {children}
      </div>
      <Separator className="my-8" />
      <footer className="text-sm text-muted-foreground text-center pb-8">
        © {new Date().getFullYear()} Skechum. All rights reserved.
      </footer>
    </div>
  )
} 