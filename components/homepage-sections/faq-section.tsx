"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { faqItems } from "@/constants/faq"




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