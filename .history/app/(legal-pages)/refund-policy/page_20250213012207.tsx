"use client"

import { Card } from "@/components/ui/card"

export default function RefundPolicyPage() {
  return (
    <div className="container max-w-4xl py-16 px-4 md:px-6">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Refund Policy</h1>
      
      <Card className="p-6 space-y-6">
        {/* Last Updated Section */}
        <div className="text-sm text-muted-foreground">
          Last Updated: {new Date().toLocaleDateString()}
        </div>

        {/* Introduction */}
        <section>
          <h2 className="text-xl font-semibold mb-3">Our Refund Policy</h2>
          <p className="text-muted-foreground">
            We strive to ensure complete satisfaction with our AI illustration generation service. 
            This policy outlines our guidelines for refunds and cancellations.
          </p>
        </section>

        {/* Eligibility */}
        <section>
          <h2 className="text-xl font-semibold mb-3">Refund Eligibility</h2>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>
              Credits must be unused and within 30 days of purchase to be eligible for a refund
            </li>
            <li>
              Technical issues preventing service usage may qualify for a refund
            </li>
            <li>
              Subscription cancellations are prorated for the unused period
            </li>
          </ul>
        </section>

        {/* How to Request */}
        <section>
          <h2 className="text-xl font-semibold mb-3">How to Request a Refund</h2>
          <p className="text-muted-foreground mb-4">
            To request a refund, please contact our support team with:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Your account email address</li>
            <li>Order/Transaction ID</li>
            <li>Reason for refund request</li>
            <li>Date of purchase</li>
          </ul>
        </section>

        {/* Processing Time */}
        <section>
          <h2 className="text-xl font-semibold mb-3">Processing Time</h2>
          <p className="text-muted-foreground">
            Refund requests are typically processed within 5-7 business days. 
            The refund will be issued to the original payment method used for the purchase.
          </p>
        </section>

        {/* Contact Information */}
        <section>
          <h2 className="text-xl font-semibold mb-3">Contact Us</h2>
          <p className="text-muted-foreground">
            If you have any questions about our refund policy, please contact us at:{" "}
            <a href="mailto:support@yourdomain.com" className="text-primary hover:underline">
              support@yourdomain.com
            </a>
          </p>
        </section>
      </Card>
    </div>
  )
} 