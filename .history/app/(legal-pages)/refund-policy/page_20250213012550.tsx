"use client"

import { Card } from "@/components/ui/card"

export default function RefundPolicyPage() {
  return (
    <article className="space-y-6">
      <h1 className="text-4xl font-bold">Refund Policy</h1>
      
      <p className="text-muted-foreground">
        Last Updated: {new Date().toLocaleDateString()}
      </p>

      <p>
        This Refund Policy outlines the terms and conditions for refunds and cancellations 
        on Skechum ("Skechum," "we," or "us"). By using our service, you agree to these 
        refund terms.
      </p>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">1. Credit Purchase Refunds</h2>
        <p>
          Our policy regarding credit purchases is designed to be fair and transparent:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          
          <li>Used credits are non-refundable</li>
          <li>Refunds will be processed to the original payment method</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">2. Subscription Cancellations</h2>
        <p>
          For subscription-based services:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>You can cancel your subscription at any time</li>
          <li>Cancellations will take effect at the end of the current billing period</li>
          <li>Pro-rated refunds may be available for annual subscriptions</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">3. Refund Eligibility</h2>
        <p>
          Refunds may be granted in the following circumstances:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Technical issues preventing service usage</li>
          <li>Duplicate charges or billing errors</li>
          <li>Unused credits within the refund window</li>
          <li>Service unavailability for extended periods</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">4. How to Request a Refund</h2>
        <p>
          To request a refund:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Contact our support team via email</li>
          <li>Include your account email and transaction ID</li>
          <li>Provide the reason for your refund request</li>
          <li>Allow 5-7 business days for processing</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">5. Exceptions</h2>
        <p>
          We reserve the right to deny refund requests that:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Fall outside the 30-day window</li>
          <li>Involve used or consumed credits</li>
          <li>Violate our terms of service</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Contact</h2>
        <p>
          If you have any questions about our refund policy, please{" "}
          <a href="/contact" className="text-primary hover:underline">
            contact us
          </a>
          .
        </p>
      </section>
    </article>
  )
} 