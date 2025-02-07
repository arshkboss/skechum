export default function PrivacyPage() {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <h1>Privacy Policy</h1>
      
      <p className="lead">
        Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
      </p>

      <h2>Information We Collect</h2>
      <h3>Account Information</h3>
      <ul>
        <li>Email address</li>
        <li>Name (if provided)</li>
        <li>Profile picture (if provided)</li>
        <li>Payment information (processed securely by our payment providers)</li>
      </ul>

      <h3>Usage Information</h3>
      <ul>
        <li>Generated images</li>
        <li>Prompts used</li>
        <li>Credit usage</li>
        <li>Device and browser information</li>
      </ul>

      <h2>How We Use Your Information</h2>
      <ul>
        <li>To provide and improve our services</li>
        <li>To process payments and manage your account</li>
        <li>To communicate with you about your account and updates</li>
        <li>To ensure the security of our platform</li>
      </ul>

      <h2>Data Storage and Security</h2>
      <p>
        We use industry-standard security measures to protect your data. Your information is stored securely on servers provided by our cloud service providers.
      </p>

      <h2>Your Rights</h2>
      <p>
        You have the right to:
      </p>
      <ul>
        <li>Access your personal data</li>
        <li>Correct inaccurate data</li>
        <li>Request deletion of your data</li>
        <li>Export your data</li>
      </ul>

      <h2>Cookies</h2>
      <p>
        We use cookies to improve your experience and analyze usage patterns. You can control cookie settings in your browser.
      </p>

      <h2>Third-Party Services</h2>
      <p>
        We use trusted third-party services for:
      </p>
      <ul>
        <li>Payment processing</li>
        <li>Analytics</li>
        <li>Email communications</li>
      </ul>

      <h2>Contact Us</h2>
      <p>
        If you have questions about our privacy practices, please <a href="/contact">contact us</a>.
      </p>

      <div className="mt-8 text-sm text-muted-foreground">
        Last updated: {new Date().toLocaleDateString()}
      </div>
    </div>
  )
} 