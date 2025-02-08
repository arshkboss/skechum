"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqItems = [
  {
    question: "What is Sketchum?",
    answer: "Sketchum is an AI-powered art generation platform that turns your ideas into beautiful illustrations in seconds. Perfect for creators, designers, and anyone who needs unique, professional artwork without the hassle of traditional design tools."
  },
  {
    question: "Do you offer free generations?",
    answer: "Yes! Every new user gets 10 free generations to try out Sketchum. This gives you plenty of opportunities to explore different styles and see the quality of our AI-generated artwork before purchasing more credits."
  },
  {
    question: "How does the credit system work?",
    answer: "Our credit system is simple and transparent - one credit equals one image generation. You can buy credits in bundles, and they never expire. No subscriptions, no hidden fees - just pay for what you need, when you need it."
  },
  {
    question: "Can I use Sketchum for commercial projects?",
    answer: "Absolutely! All artwork generated with Sketchum comes with full commercial usage rights. Use your creations in client work, marketing materials, products, or any business purpose. You retain 100% ownership of the generated artwork."
  },
  {
    question: "What styles and formats are available?",
    answer: "We offer multiple artistic styles including Notion-style illustrations, line art, and watercolor effects. You can export your creations in SVG (vector), PNG, and JPG formats, perfect for both web and print use."
  },
  {
    question: "How fast is the generation process?",
    answer: "Most illustrations are generated within 15-20 seconds. We've optimized our AI for both speed and quality, so you can quickly iterate on your ideas without compromising on results."
  },
  {
    question: "What kind of support do you offer?",
    answer: "We provide email support, comprehensive documentation, and a growing library of tutorials. Our team is always here to help you make the most of Sketchum and ensure your creative process is smooth and enjoyable."
  }
]



export function FaqSection() {
  return (
    <div className="w-full">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
        <p className="text-muted-foreground">Everything you need to know about getting started with Sketchum</p>
      </div>

      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, i) => (
            <AccordionItem 
              key={i} 
              value={`item-${i}`}
              className="border-b border-muted"
            >
              <AccordionTrigger 
                className="text-left text-muted-foreground hover:text-foreground transition-colors duration-200 hover:no-underline"
              >
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground/80">
                <div className="py-3">
                  {item.answer}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
} 