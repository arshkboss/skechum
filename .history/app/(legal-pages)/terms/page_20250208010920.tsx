export default function TermsPage() {
  return (
    <article className="space-y-6">
      <h1 className="text-4xl font-bold">Terms and Conditions</h1>
      
      <p className="text-muted-foreground">
        Last Updated: September 2, 2024
      </p>

      <p>
        Welcome, and thank you for your interest in Skechum ("Skechum," "we," or "us") 
        and our website at www.skechum.com (the "Service"). These Terms and Conditions 
        (the "Terms") are a legally binding contract between you ("User", "you", or "your") 
        and Skechum regarding your use of the Service.
      </p>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">1. Skechum Service Overview</h2>
        <p>
          Skechum operates a platform that uses artificial intelligence to create 
          illustrations based on user inputs (the "Service"). Users can upload images 
          or descriptions to generate illustrations tailored to their specifications. 
          The generated illustrations can be used for personal or commercial purposes, 
          subject to the terms set forth herein.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">2. Eligibility</h2>
        <p>
          You must be at least 18 years old to use the Service. By agreeing to these 
          Terms, you represent and warrant that:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            (a) you are at least 18 years old;
          </li>
          <li>
            (b) you have not previously been suspended or removed from the Service; and
          </li>
          <li>
            (c) your use of the Service complies with any and all applicable laws and 
            regulations. If you are a legal entity, you represent that you have the 
            authority to bind that entity to these Terms.
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">3. Use of Service</h2>
        <p>
          You are responsible for maintaining the security of your account. You must not use the service for any illegal purposes or abuse or overburden our systems.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">4. Content Rights</h2>
        <p>When you generate artwork using Skechum:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>You retain rights to the images you generate</li>
          <li>You may use the generated images for personal or commercial purposes</li>
          <li>You must not use the service to generate harmful or illegal content</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">5. Credits and Payments</h2>
        <p>Credits are non-refundable once used and unused credits expire after 12 months. We reserve the right to modify pricing at any time.</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">6. Privacy</h2>
        <p>
          Your privacy is important to us. Please review our{" "}
          <a href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </a>{" "}
          to understand how we collect and use your information.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">7. Limitations of Liability</h2>
        <p>
          Skechum provides the service "as is" without warranties of any kind. We are not liable for any damages arising from your use of the service.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">8. Changes to Terms</h2>
        <p>
          We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through the service.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Contact</h2>
        <p>
          If you have any questions about these Terms, please{" "}
          <a href="/contact" className="text-primary hover:underline">
            contact us
          </a>
          .
        </p>
      </section>
    </article>
  )
} 