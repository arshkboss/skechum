"use client"

 import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
}

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

const slideIn = (direction: "left" | "right") => ({
  hidden: { 
    opacity: 0, 
    x: direction === "left" ? -30 : 30 
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.8, 
      ease: "easeOut" 
    }
  }
})



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
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        className="py-20 md:py-32 text-center"
      >
        <motion.h1 
          variants={fadeIn}
          className="text-6xl md:text-7xl font-bold tracking-tight mb-6"
        >
          About Skechum
        </motion.h1>
        <motion.p 
          variants={fadeIn}
          className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12"
        >
          We're on a mission to make AI-powered art creation accessible to everyone
        </motion.p>
        <motion.div 
          variants={fadeIn}
          className="flex justify-center gap-4"
        >
          <Button asChild size="lg" className="rounded-full">
            <Link href="/create">Start Creating</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full">
            <Link href="/explore">View Gallery</Link>
          </Button>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <section className="py-20 max-w-6xl mx-auto px-4">
        <div className="space-y-32">
          {features.map((feature, i) => (
            <motion.div 
              key={feature.number}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={stagger}
              className={`flex flex-col ${
                i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              } items-center gap-12 md:gap-24`}
            >
              <motion.div 
                variants={slideIn(i % 2 === 0 ? "left" : "right")}
                className="flex-1 space-y-6"
              >
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 0.2, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="text-7xl font-bold text-primary/20"
                >
                  {feature.number}
                </motion.div>
                <h2 className="text-3xl font-bold">{feature.title}</h2>
                <p className="text-xl text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
              <motion.div 
                variants={slideIn(i % 2 === 0 ? "right" : "left")}
                className="flex-1"
              >
                <Image
                  src={feature.image}
                  alt={feature.title}
                  width={500}
                  height={500}
                  className="w-full"
                />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Values Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={stagger}
        className="py-20 bg-muted/50"
      >
        <div className="max-w-6xl mx-auto px-4">
          <motion.h2 
            variants={fadeIn}
            className="text-3xl font-bold text-center mb-16"
          >
            Our Values
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-12">
            {["Accessibility", "Innovation", "Community", "Quality"].map((value, i) => (
              <motion.div 
                key={value}
                variants={fadeIn}
                className="space-y-4"
              >
                <h3 className="text-xl font-semibold">{value}</h3>
                <p className="text-muted-foreground">
                  {/* Value descriptions remain the same */}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Story Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={stagger}
        className="py-20"
      >
        <div className="max-w-3xl mx-auto px-4 prose dark:prose-invert">
          <motion.h2 
            variants={fadeIn}
            className="text-3xl font-bold text-center mb-12"
          >
            Our Story
          </motion.h2>
          <motion.p 
            variants={fadeIn}
            className="text-xl text-muted-foreground"
          >
            Founded in 2024, Skechum began with a simple idea: everyone should be able to create beautiful artwork. We believe that AI technology can democratize art creation while empowering human creativity.
          </motion.p>
          <motion.p 
            variants={fadeIn}
            className="text-xl text-muted-foreground"
          >
            Today, we're building the future of digital art creation, one image at a time. Whether you're a professional designer or someone who just loves to create, Skechum is here to help you express yourself.
          </motion.p>
        </div>
      </motion.section>
    </div>
  )
} 