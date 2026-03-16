import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://teslend.com/terms',
  },
  title: 'Terms of Service',
  description: 'Teslend terms of service — read before using the platform.',
};

export default function TermsPage() {
  const updated = 'March 12, 2026';

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-400">Last updated: {updated}</p>
      </div>

      <div className="prose prose-gray max-w-none space-y-8 text-gray-700 leading-relaxed">

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">1. Overview</h2>
          <p>
            Teslend (&quot;the Platform&quot;) is a peer-to-peer listing service that connects Tesla accessory owners
            (&quot;Listers&quot;) with people who want to rent those accessories (&quot;Renters&quot;) in the San Francisco Bay Area.
            By accessing or using Teslend, you agree to these Terms of Service. If you do not agree, do not use the Platform.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">2. What Teslend Is — and Is Not</h2>
          <p>
            Teslend is a discovery and communication platform only. We are not a party to any rental agreement, transaction,
            or arrangement between Listers and Renters. We do not own, inspect, insure, or guarantee any listed item.
            We do not process, hold, or facilitate payments of any kind.
          </p>
          <p className="mt-3">
            All transactions — including payment, pickup, dropoff, and return — occur directly between the Lister and Renter.
            Teslend has no involvement in and accepts no responsibility for the outcome of those arrangements.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">3. Eligibility</h2>
          <p>
            You must be at least 18 years old and located in the United States to use Teslend.
            By creating an account, you represent that this is true.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">4. User Accounts</h2>
          <p>
            You sign in using a Google account. You are responsible for all activity that occurs under your account.
            You agree to provide accurate information and to keep it current. Teslend reserves the right to suspend
            or terminate accounts that violate these Terms or are used for abusive or fraudulent purposes.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">5. Listings</h2>
          <p>
            Listers are solely responsible for the accuracy of their listings, including descriptions, photos, pricing,
            compatibility information, and availability. Listings must be for real items that you own and have the right to rent.
            Teslend reserves the right to remove any listing at our discretion.
          </p>
          <p className="mt-3">
            Pricing shown on listings is the Lister&apos;s suggested daily rate for reference only. Actual payment terms
            are agreed between Lister and Renter directly.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">6. Inquiries and Communications</h2>
          <p>
            When a Renter submits an inquiry, their contact information is shared with the Lister via email.
            By submitting an inquiry, you consent to this. Teslend does not monitor or store the content of
            communications that occur between users outside the Platform.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">7. Prohibited Conduct</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1.5">
            <li>Post false, misleading, or fraudulent listings</li>
            <li>Use the Platform to harass, spam, or defraud other users</li>
            <li>Attempt to circumvent the Platform&apos;s security or access controls</li>
            <li>Use automated tools to scrape or abuse the Platform</li>
            <li>Impersonate another person or entity</li>
            <li>Use the Platform for any unlawful purpose</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">8. Disclaimer of Warranties</h2>
          <p>
            Teslend is provided &quot;as is&quot; without warranty of any kind. We make no representations about the accuracy,
            reliability, or completeness of any listing or user-provided content. We do not warrant that the Platform
            will be uninterrupted or error-free.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">9. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, Teslend and its operators shall not be liable for any indirect,
            incidental, special, or consequential damages arising from your use of the Platform or any transaction
            arranged through it, including but not limited to damage to or loss of rented items, personal injury,
            or financial loss.
          </p>
          <p className="mt-3">
            By using Teslend, whether as a Lister or Renter, you acknowledge that you assume all risks associated
            with peer-to-peer rental arrangements and that Teslend bears no responsibility for any outcome.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">10. Intellectual Property</h2>
          <p>
            The Teslend name, logo, and platform design are proprietary. You may not use them without permission.
            By posting content (listings, photos, descriptions), you grant Teslend a non-exclusive license to display
            that content on the Platform.
          </p>
          <p className="mt-3">
            Teslend is not affiliated with, endorsed by, or sponsored by Tesla, Inc.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">11. Changes to These Terms</h2>
          <p>
            We may update these Terms from time to time. Continued use of the Platform after changes are posted
            constitutes your acceptance of the revised Terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">12. Contact</h2>
          <p>
            Questions about these Terms? Use our <Link href="/contact" className="text-gray-900 underline underline-offset-2 hover:text-black">contact form</Link>.
          </p>
        </section>

      </div>
    </div>
  );
}
