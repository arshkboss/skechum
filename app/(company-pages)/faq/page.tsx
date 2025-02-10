"use client"

import { motion } from "framer-motion"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import { faqItems } from "@/constants/faq"

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
          {faqItems.map((faq, index) => (
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