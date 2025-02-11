import { motion } from "framer-motion"
import React from 'react'
import Image from "next/image"
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
  
function StorySection() {
  return (
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
  )
}

export default StorySection