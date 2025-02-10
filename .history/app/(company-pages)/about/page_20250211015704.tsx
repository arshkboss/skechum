"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

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



const values = [
  {
    title: "Accessibility",
    description: "We believe art creation should be accessible to everyone, regardless of their technical skills or background. Our platform makes it easy for anyone to bring their creative vision to life."
  },
  {
    title: "Innovation",
    description: "By combining cutting-edge AI technology with intuitive design, we're constantly pushing the boundaries of what's possible in digital art creation. We stay at the forefront of technological advancements."
  },
  {
    title: "Community",
    description: "We foster a supportive environment where creators can share their work, learn from each other, and grow together. Our community celebrates diversity and creativity in all its forms."
  },
  {
    title: "Quality",
    description: "We're committed to delivering the highest quality AI-generated artwork. Our advanced models and fine-tuned parameters ensure exceptional results that meet professional standards."
  }
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
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
        >
          About Skechum
        </motion.h1>
        <motion.p 
          variants={fadeIn}
          className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 px-4"
        >
          We&apos;re on a mission to make AI-powered art creation accessible to everyone
        </motion.p>
        <motion.div 
          variants={fadeIn}
          className="flex flex-col sm:flex-row justify-center gap-4 px-4"
        >
          <Button asChild size="lg" className="rounded-full">
            <Link href="/create">Create Illustrations 
            <ArrowRight className="w-4 h-4 ml-2 animate-pulse" /></Link>
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
            {values.map((value) => (
              <motion.div 
                key={value.title}
                variants={fadeIn}
                className="space-y-4"
              >
                <h3 className="text-xl font-semibold">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {value.description}
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
        <div className="max-w-4xl mx-auto px-4">
          <motion.h2 
            variants={fadeIn}
            className="text-3xl font-bold text-center mb-12"
          >
            Our Story
          </motion.h2>
          <div className="space-y-6">
            <motion.p 
              variants={fadeIn}
              className="text-lg text-muted-foreground leading-relaxed"
            >
              Founded in 2024, Skechum began with a simple idea: everyone should be able to create beautiful artwork. We believe that AI technology can democratize art creation while empowering human creativity.
            </motion.p>
            <motion.p 
              variants={fadeIn}
              className="text-lg text-muted-foreground leading-relaxed"
            >
              Today, we're building the future of digital art creation, one image at a time. Whether you're a professional designer or someone who just loves to create, Skechum is here to help you express yourself.
            </motion.p>
            <motion.p 
              variants={fadeIn}
              className="text-lg text-muted-foreground leading-relaxed"
            >
              Our platform combines state-of-the-art AI models with an intuitive interface, making it possible for anyone to transform their ideas into stunning illustrations. We're committed to continuous innovation and improvement, always striving to provide our users with the best possible creative experience.
            </motion.p>
          </div>
        </div>
      </motion.section>
    </div>
  )
} 