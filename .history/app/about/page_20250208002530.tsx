import { Metadata } from "next"
import { Card } from "@/components/ui/card"
import { Brush, Sparkles, Shield, Users } from "lucide-react"

export const metadata: Metadata = {
  title: "About Skechum",
  description: "Learn about our mission to make AI art creation accessible to everyone",
}

const features = [
  {
    name: "AI-Powered Art",
    description: "Transform your ideas into beautiful artwork using advanced AI technology",
    icon: Sparkles,
  },
  {
    name: "Multiple Styles",
    description: "Choose from a variety of artistic styles to match your vision",
    icon: Brush,
  },
  {
    name: "Secure Platform",
    description: "Your data and creations are protected with enterprise-grade security",
    icon: Shield,
  },
  {
    name: "Growing Community",
    description: "Join thousands of creators sharing their artistic journey",
    icon: Users,
  },
]

export default function AboutPage() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">About Skechum</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          We're on a mission to make AI-powered art creation accessible to everyone
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {features.map((feature) => (
          <Card key={feature.name} className="p-6 space-y-2">
            <div className="flex items-center gap-2">
              <feature.icon className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">{feature.name}</h3>
            </div>
            <p className="text-muted-foreground">{feature.description}</p>
          </Card>
        ))}
      </div>

      <div className="prose dark:prose-invert max-w-none">
        <h2>Our Story</h2>
        <p>
          Founded in 2024, Skechum began with a simple idea: everyone should be able to create beautiful artwork, regardless of their artistic background. We believe that AI technology can democratize art creation while empowering human creativity.
        </p>

        <h2>Our Vision</h2>
        <p>
          We envision a world where anyone can bring their creative ideas to life through the power of AI. Whether you're a professional designer or someone who just loves to create, Skechum is here to help you express yourself.
        </p>

        <h2>Our Values</h2>
        <ul>
          <li>Accessibility - Making art creation available to everyone</li>
          <li>Innovation - Pushing the boundaries of AI technology</li>
          <li>Community - Building a supportive environment for creators</li>
          <li>Quality - Delivering the best possible results</li>
        </ul>
      </div>
    </div>
  )
} 