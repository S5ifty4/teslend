import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://teslend.com/privacy',
  },
  title: 'Privacy Policy',
  description: 'Teslend privacy policy — what data we collect and how we use it.',
};

export default function PrivacyPage() {
  const updated = 'March 12, 2026';

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-400">Last updated: {updated}</p>
      </div>

      <div className="prose prose-gray max-w-none space-y-8 text-gray-700 leading-relaxed">

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">1. What We Collect</h2>
          <p>When you use Teslend, we collect:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1.5">
            <li><strong>Account information</strong> — your name, email address, and profile photo, provided by Google when you sign in via Google OAuth</li>
            <li><strong>Profile information</strong> — your Tesla model, phone number, and city, if you choose to add them</li>
            <li><strong>Listing content</strong> — titles, descriptions, photos, pricing, and other details you provide when creating a listing</li>
            <li><strong>Inquiry data</strong> — rental dates, vehicle info, contact details, and notes submitted in inquiry forms</li>
            <li><strong>Usage data</strong> — standard server logs including IP address, browser type, and pages visited</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">2. How We Use Your Data</h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1.5">
            <li>Operate the Platform and display your listings to other users</li>
            <li>Send inquiry emails to listing owners on behalf of renters</li>
            <li>Send confirmation emails to renters when an inquiry is submitted</li>
            <li>Authenticate you via Google OAuth</li>
            <li>Respond to support requests submitted via the contact form</li>
            <li>Detect and prevent abuse, spam, and fraudulent activity</li>
          </ul>
          <p className="mt-3">
            We do not sell your personal information. We do not use your data for advertising.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">3. What We Share</h2>
          <p>
            When a Renter submits an inquiry, their name, email address, phone number, and rental details are shared
            with the Lister via email. This is the core function of the Platform — you consent to this when submitting
            an inquiry.
          </p>
          <p className="mt-3">
            We do not expose your email address to other users through the website interface. Email sharing only
            occurs through the inquiry and contact email relay.
          </p>
          <p className="mt-3">
            We share data with the following third-party services to operate the Platform:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1.5">
            <li><strong>Cloud database provider</strong> — secure storage of account data, listings, and uploaded files</li>
            <li><strong>Cloud hosting provider</strong> — application hosting and global content delivery</li>
            <li><strong>Email delivery provider</strong> — transactional emails (inquiry confirmations, contact replies)</li>
            <li><strong>Google</strong> — authentication via Google Sign-In</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">4. Data Retention</h2>
          <p>
            Your account data and listings are retained as long as your account is active.
            Inquiry records are retained for operational purposes. You may request deletion of your account
            and associated data at any time by contacting us.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">5. Cookies and Tracking</h2>
          <p>
            Teslend uses session cookies for authentication. We do not use advertising cookies, tracking pixels,
            or third-party analytics beyond standard server-side logging. We do not use Google Analytics or
            similar services.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">6. Your Rights</h2>
          <p>You may:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1.5">
            <li>Update your profile information at any time from your Profile page</li>
            <li>Delete your listings from My Listings</li>
            <li>Request deletion of your account and all associated data by contacting us</li>
          </ul>
          <p className="mt-3">
            California residents have additional rights under the CCPA. Contact us for more information.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">7. Security</h2>
          <p>
            We use industry-standard practices to protect your data, including encrypted connections (HTTPS),
            server-side authentication, and role-based database access. No system is perfectly secure;
            use the Platform at your own risk.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">8. Children</h2>
          <p>
            Teslend is not directed at children under 13. We do not knowingly collect data from children.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">9. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Continued use of the Platform after changes
            are posted constitutes your acceptance of the revised Policy.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">10. Contact</h2>
          <p>
            Questions or data requests? Use our <Link href="/contact" className="text-gray-900 underline underline-offset-2 hover:text-black">contact form</Link>.
          </p>
        </section>

      </div>
    </div>
  );
}
