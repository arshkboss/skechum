export default function TermsPage() {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <h1>Terms of Service</h1>
      
      <p className="lead">
        Welcome to Skechum. By using our service, you agree to these terms. Please read them carefully.
      </p>

      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing or using Skechum's services, you agree to be bound by these Terms of Service and all applicable laws and regulations.
      </p>

      <h2>2. Use of Service</h2>
      <ul>
        <li>You must be at least 13 years old to use this service</li>
        <li>You are responsible for maintaining the security of your account</li>
        <li>You must not use the service for any illegal purposes</li>
        <li>You agree not to abuse or overburden our systems</li>
      </ul>

      <h2>3. Content Rights</h2>
      <p>
        When you generate artwork using Skechum:
      </p>
      <ul>
        <li>You retain rights to the images you generate</li>
        <li>You may use the generated images for personal or commercial purposes</li>
        <li>You must not use the service to generate harmful or illegal content</li>
      </ul>

      <h2>4. Credits and Payments</h2>
      <ul>
        <li>Credits are non-refundable once used</li>
        <li>Unused credits expire after 12 months</li>
        <li>We reserve the right to modify pricing at any time</li>
      </ul>

      <h2>5. Privacy</h2>
      <p>
        Your privacy is important to us. Please review our <a href="/privacy">Privacy Policy</a> to understand how we collect and use your information.
      </p>

      <h2>6. Limitations of Liability</h2>
      <p>
        Skechum provides the service "as is" without warranties of any kind. We are not liable for any damages arising from your use of the service.
      </p>

      <h2>7. Changes to Terms</h2>
      <p>
        We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through the service.
      </p>

      <h2>8. Contact</h2>
      <p>
        If you have any questions about these terms, please <a href="/contact">contact us</a>.
      </p>

      <div className="mt-8 text-sm text-muted-foreground">
        Last updated: {new Date().toLocaleDateString()}
      </div>
    </div>
  )
} 