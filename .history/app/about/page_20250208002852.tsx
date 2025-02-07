import { Metadata } from "next"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

export const metadata: Metadata = {
  title: "About Skechum",
  description: "Learn about our mission to make AI art creation accessible to everyone",
}

const features = [
  {
    number: "1",
    title: "Transform Ideas",
    description: "Turn your imagination into beautiful artwork using advanced AI. No artistic background needed.",
    image: "/illustrations/artist.svg", // Add your illustration
  },
  {
    number: "2",
    title: "Choose Your Style",
    description: "Select from a variety of artistic styles to match your vision. From realistic to abstract, we've got you covered.",
    image: "/illustrations/palette.svg",
  },
  {
    number: "3",
    title: "Share & Connect",
    description: "Join a community of creators, share your work, and get inspired by others.",
    image: "/illustrations/community.svg",
  },
]

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Digital Artist",
    content: "Skechum has revolutionized how I approach concept art. What used to take hours now takes minutes.",
    avatar: "/avatars/sarah.jpg",
  },
  // Add more testimonials
]

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 md:py-32 text-center">
        <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-6">
          About Skechum
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12">
          We're on a mission to make AI-powered art creation accessible to everyone
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild size="lg" className="rounded-full">
            <Link href="/create">Start Creating</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full">
            <Link href="/explore">View Gallery</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 max-w-6xl mx-auto px-4">
        <div className="space-y-32">
          {features.map((feature, i) => (
            <div 
              key={feature.number}
              className={`flex flex-col ${
                i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              } items-center gap-12 md:gap-24`}
            >
              <div className="flex-1 space-y-6">
                <div className="text-7xl font-bold text-primary/20">
                  {feature.number}
                </div>
                <h2 className="text-3xl font-bold">{feature.title}</h2>
                <p className="text-xl text-muted-foreground">
                  {feature.description}
                </p>
              </div>
              <div className="flex-1">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  width={500}
                  height={500}
                  className="w-full"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Accessibility</h3>
              <p className="text-muted-foreground">
                Making art creation available to everyone, regardless of their background or experience.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Innovation</h3>
              <p className="text-muted-foreground">
                Pushing the boundaries of AI technology to deliver the best possible results.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Community</h3>
              <p className="text-muted-foreground">
                Building a supportive environment where creators can learn and grow together.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Quality</h3>
              <p className="text-muted-foreground">
                Ensuring every generated artwork meets our high standards of excellence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 prose dark:prose-invert">
          <h2 className="text-3xl font-bold text-center mb-12">Our Story</h2>
          <p className="text-xl text-muted-foreground">
            Founded in 2024, Skechum began with a simple idea: everyone should be able to create beautiful artwork. We believe that AI technology can democratize art creation while empowering human creativity.
          </p>
          <p className="text-xl text-muted-foreground">
            Today, we're building the future of digital art creation, one image at a time. Whether you're a professional designer or someone who just loves to create, Skechum is here to help you express yourself.
          </p>
        </div>
      </section>
    </div>
  )
} 