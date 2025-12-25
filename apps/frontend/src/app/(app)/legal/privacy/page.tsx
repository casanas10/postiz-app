import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy - Postiz by Leap Tech LLC',
  description: 'Privacy Policy for Postiz, a social media management platform by Leap Tech LLC',
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/auth" className="text-blue-400 hover:underline">
            &larr; Back to Home
          </Link>
        </div>

        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <p className="text-xl text-gray-300 mb-4">Postiz by Leap Tech LLC</p>

        <div className="prose prose-invert max-w-none space-y-6">
          <p className="text-gray-300">
            <strong>Last Updated:</strong> December 2025
          </p>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
            <p>
              Welcome to Postiz, a social media management platform operated by Leap Tech LLC (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). This Privacy Policy explains how Postiz collects, uses, discloses, and safeguards your information when you use our platform and services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Information We Collect</h2>
            <h3 className="text-xl font-medium mt-4 mb-2">Personal Information</h3>
            <p>We may collect personal information that you voluntarily provide, including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Name and email address</li>
              <li>Account credentials</li>
              <li>Company or organization name</li>
              <li>Payment information (processed securely through third-party providers)</li>
              <li>Social media account information you choose to connect</li>
            </ul>

            <h3 className="text-xl font-medium mt-4 mb-2">Automatically Collected Information</h3>
            <p>When you use Postiz, we automatically collect:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Device and browser information</li>
              <li>IP address and location data</li>
              <li>Usage data and analytics</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">3. How We Use Your Information</h2>
            <p>Postiz uses your information to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide and maintain our services</li>
              <li>Process your transactions</li>
              <li>Send administrative information and updates</li>
              <li>Respond to inquiries and provide support</li>
              <li>Improve and personalize your experience</li>
              <li>Analyze usage patterns to enhance our platform</li>
              <li>Protect against fraudulent or unauthorized activity</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Information Sharing</h2>
            <p>We may share your information with:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Service providers who assist in operating our platform</li>
              <li>Social media platforms you connect to Postiz</li>
              <li>Legal authorities when required by law</li>
              <li>Business partners with your consent</li>
            </ul>
            <p className="mt-4">We do not sell your personal information to third parties.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Your Rights</h2>
            <p>Depending on your location, you may have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to or restrict processing</li>
              <li>Data portability</li>
              <li>Withdraw consent</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">7. Cookies</h2>
            <p>
              Postiz uses cookies and similar technologies to enhance your experience, analyze usage, and provide personalized content. You can control cookie preferences through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">8. Third-Party Services</h2>
            <p>
              Our platform integrates with third-party social media services. Your use of these services is governed by their respective privacy policies. We encourage you to review the privacy policies of any third-party services you connect to Postiz.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">9. Children&apos;s Privacy</h2>
            <p>
              Postiz is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last Updated&quot; date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">11. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy or our privacy practices, please contact us at{' '}
              <a href="mailto:alex@leaptechai.com" className="text-blue-400 hover:underline">
                alex@leaptechai.com
              </a>.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-700">
          <Link href="/legal/terms" className="text-blue-400 hover:underline">
            View Terms of Service
          </Link>
        </div>
      </div>
    </div>
  );
}
