import { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, MessageSquare, Twitter } from "lucide-react"

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the Skechum team",
}

export default function ContactPage() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Contact Us</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Have questions? We're here to help.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="p-6">
          <form className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name">Name</label>
              <Input id="name" placeholder="Your name" />
            </div>
            <div className="space-y-2">
              <label htmlFor="email">Email</label>
              <Input id="email" type="email" placeholder="your@email.com" />
            </div>
            <div className="space-y-2">
              <label htmlFor="message">Message</label>
              <Textarea id="message" placeholder="How can we help?" />
            </div>
            <Button className="w-full">Send Message</Button>
          </form>
        </Card>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Other Ways to Reach Us</h2>
          
          <div className="space-y-4">
            <a href="mailto:support@skechum.com" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <Mail className="h-5 w-5" />
              support@skechum.com
            </a>
            
            <a href="https://twitter.com/skechum" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <Twitter className="h-5 w-5" />
              @skechum
            </a>
            
            <div className="flex items-center gap-2 text-muted-foreground">
              <MessageSquare className="h-5 w-5" />
              Response time: Within 24 hours
            </div>
          </div>

          <div className="prose dark:prose-invert">
            <h3>FAQ</h3>
            <p>
              Before reaching out, you might want to check our{" "}
              <a href="/faq">frequently asked questions</a>. You'll find answers to common questions about our service, pricing, and more.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 