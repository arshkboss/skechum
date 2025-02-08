import React from 'react'
import { testimonials } from "@/constants/testimonials"
import { Card } from "@/components/ui/card"
function Testimonials() {
  return (
    <section className="w-full py-24">


    <div className="px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-3xl font-bold">What Our Users Say</h2>
        <p className="text-muted-foreground">Join thousands of satisfied creators</p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, i) => (
          <Card key={i} className="p-6 space-y-4">
            <div className="flex items-center gap-4">
              <img
                src={testimonial.avatar}
                alt={testimonial.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </div>
            <p className="text-sm">{testimonial.content}</p>
          </Card>
        ))}
      </div>
    </div>
  </section>

  )
}

export default Testimonials