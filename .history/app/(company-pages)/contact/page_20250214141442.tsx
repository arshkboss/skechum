"use client"

import { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, MessageSquare, MapPin, Clock } from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"
import { useState, useRef } from "react"

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

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    description: "Our friendly team is here to help.",
    detail: "support@skechum.com",
    href: "mailto:support@skechum.com"
  },
  {
    icon: MapPin,
    title: "Office",
    description: "Come say hello at our office.",
    detail: "Bhopal, India"
  },

  {
    icon: Clock,
    title: "Support Hours",
    description: "We are here for you.",
    detail: "Monday - Friday, 9am - 5pm IST"

  }
]




export default function ContactPage() {
  const { toast } = useToast()
  const formRef = useRef<HTMLFormElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(formRef.current!)
      formData.append("access_key", "1e250b77-b3f2-4ebf-ad57-634903ce6909")

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success!",
          description: "Your message has been sent successfully.",
          variant: "default",
        })
        formRef.current?.reset()
      } else {
        throw new Error(data.message || "Something went wrong")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* Background */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-gray-950">
        <div className="absolute h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex justify-center">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            transition={{ duration: 1 }}
            className="h-[310px] w-[310px] rounded-full bg-gradient-to-r from-primary to-primary-foreground blur-3xl"
          />
        </div>

        <div className="container relative py-20">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="max-w-4xl mx-auto"
          >
            {/* Header */}
            <div className="text-center mb-16 space-y-4">
              <motion.h1 
                variants={fadeIn}
                className="text-4xl md:text-6xl font-bold tracking-tight"
              >
                Get in Touch
              </motion.h1>
              <motion.p 
                variants={fadeIn}
                className="text-xl text-muted-foreground"
              >
                Have a question? We would love to hear from you.
              </motion.p>
            </div>


            {/* Contact Info Cards */}
            <motion.div 
              variants={stagger}
              className="grid md:grid-cols-3 gap-8 mb-16"
            >
              {contactInfo.map((item) => (
                <motion.div key={item.title} variants={fadeIn}>
                  <Card className="p-6 h-full backdrop-blur-sm bg-white/50 dark:bg-gray-950/50">
                    <item.icon className="h-6 w-6 text-primary mb-4" />
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {item.description}
                    </p>
                    {item.href ? (
                      <a 
                        href={item.href}
                        className="text-sm font-medium hover:text-primary transition-colors"
                      >
                        {item.detail}
                      </a>
                    ) : (
                      <p className="text-sm font-medium">{item.detail}</p>
                    )}
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Contact Form */}
            <motion.div variants={fadeIn}>
              <Card className="p-8 backdrop-blur-sm bg-white/50 dark:bg-gray-950/50">
                <form ref={formRef} onSubmit={onSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Name
                      </label>
                      <Input 
                        id="name"
                        name="name"
                        placeholder="Your name"
                        className="bg-white/50 dark:bg-gray-900/50"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email
                      </label>
                      <Input 
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        className="bg-white/50 dark:bg-gray-900/50"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">
                      Subject
                    </label>
                    <Input 
                      id="subject"
                      name="subject"
                      placeholder="How can we help?"
                      className="bg-white/50 dark:bg-gray-900/50"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Message
                    </label>
                    <Textarea 
                      id="message"
                      name="message"
                      placeholder="Your message..."
                      rows={6}
                      className="bg-white/50 dark:bg-gray-900/50 resize-none"
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </Card>
            </motion.div>

            {/* FAQ Link */}
            <motion.div 
              variants={fadeIn}
              className="text-center mt-12"
            >
              <p className="text-muted-foreground">
                Have a simple question? Check our{" "}
                <a 
                  href="/faq" 
                  className="text-primary hover:underline"
                >
                  FAQ page
                </a>
                {" "}first.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  )
} 