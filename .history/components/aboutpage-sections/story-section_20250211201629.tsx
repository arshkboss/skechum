import { motion, stagger } from 'motion/dist/react'
import React from 'react'
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
function StorySection() {
  return (
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
  )
}

export default StorySection