"use client"

import { motion } from "framer-motion"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

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
      staggerChildren: 0.1
    }
  }
}

const faqs = [
  {
    question: "What is Skechum?",
    answer: "Skechum is an AI-powered platform that helps you create beautiful vector illustrations from text descriptions. Whether you're a designer, content creator, or just someone who loves to create, our platform makes it easy to bring your ideas to life."
  },
  {
    question: "How does it work?",
    answer: "Simply describe what you want to create in natural language, choose a style, and our AI will generate a unique illustration based on your description. You can then download your creation in various formats (PNG, SVG, JPG)."
  },
  {
    question: "What can I create with Skechum?",
    answer: "You can create a wide range of illustrations including icons, characters, scenes, logos, and more. Our AI understands complex descriptions and can generate both simple and detailed illustrations based on your needs."
  },
  {
    question: "Do I need any design experience?",
    answer: "Not at all! Skechum is designed to be user-friendly and accessible to everyone, regardless of their design experience. Our intuitive interface and AI technology make it easy to create professional-looking illustrations."
  },
  {
    question: "What file formats are supported?",
    answer: "We support multiple export formats including PNG, SVG, and JPG. SVG files are perfect for scalable vector graphics, while PNG and JPG are great for web and print use."
  },
  {
    question: "How much does it cost?",
    answer: "We offer a credit-based system. Each generation costs 3 credits for standard illustrations and 5 credits for SVG format. You can purchase credits as needed, and we often run promotions for new users."
  },
  {
    question: "Can I use the illustrations commercially?",
    answer: "Yes! All illustrations you create with Skechum are yours to use for both personal and commercial purposes. You retain full rights to your creations."
  },
  {
    question: "Is there a limit to how many illustrations I can create?",
    answer: "The only limit is your available credits. You can create as many illustrations as you like as long as you have sufficient credits in your account."
  }
]

export default function FAQPage() {
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
          Frequently Asked Questions
        </motion.h1>
        <motion.p 
          variants={fadeIn}
          className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 px-4"
        >
          Everything you need to know about Skechum
        </motion.p>
      </motion.section>

      {/* FAQ Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        className="py-12 max-w-3xl mx-auto px-4 mb-20"
      >
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              variants={fadeIn}
            >
              <AccordionItem value={`item-${index}`} className="border rounded-lg px-6">
                <AccordionTrigger className="text-lg font-medium hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </motion.section>
    </div>
  )
} 