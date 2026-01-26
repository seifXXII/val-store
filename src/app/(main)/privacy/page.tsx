/**
 * Privacy Policy Page
 */

export const metadata = {
  title: "Privacy Policy | Val Store",
  description: "Val Store privacy policy and data protection information.",
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
      <p className="text-muted-foreground mb-8">Last updated: January 2026</p>

      <div className="prose dark:prose-invert max-w-3xl">
        <h2>1. Information We Collect</h2>
        <p>
          We collect information you provide directly, such as when you create
          an account, make a purchase, or contact us. This may include:
        </p>
        <ul>
          <li>Name and email address</li>
          <li>Shipping and billing address</li>
          <li>Payment information</li>
          <li>Order history</li>
          <li>Communication preferences</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Process and fulfill your orders</li>
          <li>Send order confirmations and shipping updates</li>
          <li>Provide customer support</li>
          <li>Send marketing emails (with your consent)</li>
          <li>Improve our products and services</li>
        </ul>

        <h2>3. Information Sharing</h2>
        <p>
          We do not sell your personal information. We may share your
          information with:
        </p>
        <ul>
          <li>Payment processors to complete transactions</li>
          <li>Shipping carriers to deliver your orders</li>
          <li>Service providers who assist our operations</li>
        </ul>

        <h2>4. Data Security</h2>
        <p>
          We implement appropriate security measures to protect your personal
          information. All payment transactions are encrypted using SSL
          technology.
        </p>

        <h2>5. Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access your personal data</li>
          <li>Correct inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Opt out of marketing communications</li>
        </ul>

        <h2>6. Cookies</h2>
        <p>
          We use cookies to improve your browsing experience, analyze site
          traffic, and personalize content. You can manage cookie preferences in
          your browser settings.
        </p>

        <h2>7. Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy, please contact us at{" "}
          <a href="mailto:privacy@valstore.com">privacy@valstore.com</a>.
        </p>
      </div>
    </div>
  );
}
