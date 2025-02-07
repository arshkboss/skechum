export default function TermsPage() {
  return (
    <article className="space-y-8">
      <header className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Terms of Service</h1>
        <p className="text-xl text-muted-foreground">
          Welcome to Skechum. By using our service, you agree to these terms. Please read them carefully.
        </p>
      </header>

      <section className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">1. Acceptance of Terms</h2>
          <p>
            By accessing or using Skechum's services, you agree to be bound by these Terms of Service and all applicable laws and regulations.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">2. Use of Service</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>You must be at least 13 years old to use this service</li>
            <li>You are responsible for maintaining the security of your account</li>
            <li>You must not use the service for any illegal purposes</li>
            <li>You agree not to abuse or overburden our systems</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">3. Content Rights</h2>
          <p>When you generate artwork using Skechum:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>You retain rights to the images you generate</li>
            <li>You may use the generated images for personal or commercial purposes</li>
            <li>You must not use the service to generate harmful or illegal content</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">4. Credits and Payments</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Credits are non-refundable once used</li>
            <li>Unused credits expire after 12 months</li>
            <li>We reserve the right to modify pricing at any time</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">5. Privacy</h2>
          <p>
            Your privacy is important to us. Please review our{" "}
            <a href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </a>{" "}
            to understand how we collect and use your information.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">6. Limitations of Liability</h2>
          <p>
            Skechum provides the service "as is" without warranties of any kind. We are not liable for any damages arising from your use of the service.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">7. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through the service.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">8. Contact</h2>
          <p>
            If you have questions about these terms, please{" "}
            <a href="/contact" className="text-primary hover:underline">
              contact us
            </a>
            .
          </p>
        </div>
      </section>

      <footer className="pt-8 text-sm text-muted-foreground">
        Last updated: {new Date().toLocaleDateString()}
      </footer>
    </article>
  )
} 