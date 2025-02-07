export default function CopyrightPage() {
  return (
    <article className="space-y-6">
      <h1 className="text-4xl font-bold">Copyright Policy</h1>
      
      <p className="text-muted-foreground">
        Last Updated: September 2, 2024
      </p>

      <p>
        This Copyright Policy explains how Skechum handles intellectual property rights 
        and copyright matters related to our AI art generation service.
      </p>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">1. Generated Content Rights</h2>
        <p>
          When you generate artwork using Skechum&apos;s AI service:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>You retain the rights to the images you generate</li>
          <li>You may use the generated images for both personal and commercial purposes</li>
          <li>You receive a worldwide, non-exclusive license to use the generated content</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">2. User Responsibilities</h2>
        <p>When using our service, you agree to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Not infringe on others&apos; intellectual property rights</li>
          <li>Not generate content that violates copyright laws</li>
          <li>Not use the service to create unauthorized reproductions of copyrighted works</li>
          <li>Respect trademark rights and other intellectual property protections</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">3. DMCA Compliance</h2>
        <p>
          We respect intellectual property rights and comply with the Digital Millennium 
          Copyright Act (DMCA). If you believe your copyrighted work has been used 
          inappropriately on our service, please submit a DMCA takedown notice.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">4. Takedown Requests</h2>
        <p>To submit a copyright takedown request, please provide:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Identification of the copyrighted work</li>
          <li>Location of the alleged infringing material</li>
          <li>Your contact information</li>
          <li>A statement of good faith belief</li>
          <li>A statement of accuracy under penalty of perjury</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">5. Counter Notices</h2>
        <p>
          If you believe your content was removed in error, you may submit a counter 
          notice. We will process counter notices in accordance with DMCA requirements.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">6. Repeat Infringers</h2>
        <p>
          We maintain a policy of terminating accounts of users who are repeat 
          infringers of intellectual property rights.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Contact</h2>
        <p>
          For copyright-related matters, please contact our copyright agent at{" "}
          <a href="mailto:copyright@skechum.com" className="text-primary hover:underline">
            copyright@skechum.com
          </a>
          {" "}or{" "}
          <a href="/contact" className="text-primary hover:underline">
            contact us
          </a>
          .
        </p>
      </section>
    </article>
  )
} 