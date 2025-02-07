export default function PrivacyPage() {
  return (
    <article className="space-y-6">
      <h1 className="text-4xl font-bold">Privacy Policy</h1>
      
      <p className="text-muted-foreground">
        Last Updated: September 2, 2024
      </p>

      <p>
        At Skechum ("we," "our," or "us"), we value your privacy and are committed to 
        protecting your personal information. This Privacy Policy explains how we collect, 
        use, and safeguard your data when you use our service.
      </p>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">1. Information We Collect</h2>
        <h3 className="text-xl font-semibold">Account Information</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>Email address</li>
          <li>Name (if provided)</li>
          <li>Profile picture (if provided)</li>
          <li>Payment information (processed securely by our payment providers)</li>
        </ul>

        <h3 className="text-xl font-semibold">Usage Information</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>Generated images and prompts</li>
          <li>Credit usage history</li>
          <li>Device and browser information</li>
          <li>IP address and location data</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">2. How We Use Your Information</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>To provide and improve our services</li>
          <li>To process payments and manage your account</li>
          <li>To communicate with you about your account and updates</li>
          <li>To ensure the security of our platform</li>
          <li>To analyze usage patterns and improve user experience</li>
          <li>To comply with legal obligations</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">3. Data Storage and Security</h2>
        <p>
          We implement industry-standard security measures to protect your data. Your information 
          is stored securely on servers provided by our cloud service providers. We regularly 
          review and update our security practices to ensure the safety of your data.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">4. Your Rights</h2>
        <p>You have the right to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Access your personal data</li>
          <li>Correct inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Export your data</li>
          <li>Opt-out of marketing communications</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">5. Cookies and Tracking</h2>
        <p>
          We use cookies and similar technologies to improve your experience and analyze usage 
          patterns. You can control cookie settings through your browser preferences.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">6. Third-Party Services</h2>
        <p>We use trusted third-party services for:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Payment processing</li>
          <li>Analytics</li>
          <li>Email communications</li>
          <li>Cloud storage</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">7. Updates to Privacy Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of any 
          significant changes via email or through our service.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Contact Us</h2>
        <p>
          If you have questions about our privacy practices, please{" "}
          <a href="/contact" className="text-primary hover:underline">
            contact us
          </a>
          .
        </p>
      </section>
    </article>
  )
} 