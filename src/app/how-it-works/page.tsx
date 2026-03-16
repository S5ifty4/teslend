import type { Metadata } from 'next';
import Link from 'next/link';
import ListButton from '@/components/ListButton';
import { ChevronDown } from 'lucide-react';

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://teslend.com/how-it-works',
  },
  title: 'How It Works | Teslend',
  description: 'Learn how Teslend connects Tesla owners with people who need their accessories for a weekend or a trip.',
};

const faqs = [
  {
    q: 'What is Teslend?',
    a: 'Teslend is a peer-to-peer listing platform where Tesla owners in the Bay Area can list accessories they own (bike racks, ski carriers, roof systems, tow hitches, camping gear) for other Tesla owners to rent. Think Craigslist or Facebook Marketplace, but specifically for Tesla accessories.',
  },
  {
    q: 'How does a rental actually work?',
    a: 'You find an item, submit an inquiry with your rental dates and contact info. The owner receives an email with your details and reaches out to you directly to arrange pickup, dropoff, and payment. Teslend facilitates the discovery; the actual transaction happens between the two of you.',
  },
  {
    q: 'Does Teslend handle payments?',
    a: 'No. Teslend does not process, hold, or facilitate any payments. Pricing shown on listings is the owner\'s suggested daily rate for reference only. How you pay (Venmo, Zelle, cash, whatever) is entirely between you and the owner.',
  },
  {
    q: 'Is there a fee to list or rent?',
    a: 'No. Listing an accessory and sending inquiries are both completely free. Teslend is currently free to use for everyone.',
  },
  {
    q: 'What if an item gets damaged during a rental?',
    a: 'Teslend is not a party to any rental agreement and is not responsible for damage, loss, theft, or any other outcome of a rental transaction. Owners and renters are responsible for agreeing on terms, deposits, and handling any disputes between themselves before handing anything over.',
  },
  {
    q: 'How do I know the listing is legit?',
    a: 'All users sign in with a verified Google account, so you can see the owner\'s name and profile. That said, Teslend does not verify the condition or accuracy of listings. Use common sense: meet in a public place, inspect the item before taking it, and only rent from people you feel comfortable with.',
  },
  {
    q: 'What areas do you cover?',
    a: 'Bay Area first: San Francisco, East Bay, South Bay, Peninsula, and the surrounding counties. We plan to expand to other metro areas as the community grows.',
  },
  {
    q: 'Why Tesla accessories only?',
    a: 'Tesla vehicles have proprietary or model-specific mounting systems (roof racks, hitch receivers, cargo solutions) that often don\'t cross over to other brands. Keeping the platform focused means renters can filter by their specific model and know the item will fit.',
  },
  {
    q: 'Can I list something that works on non-Tesla vehicles too?',
    a: 'If you own it and have rented it for use with your Tesla, yes. Select the Tesla model you\'ve used it with; renters are responsible for verifying compatibility with their own vehicle.',
  },
  {
    q: 'I sent an inquiry. What now?',
    a: 'The listing owner will receive an email with your rental dates, contact info, and any note you included. It\'s up to them to respond directly to your email or phone number. If you don\'t hear back within a day or two, the owner may be unavailable.',
  },
];

export default function HowItWorksPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      {/* Header */}
      <div className="mb-14">
        <h1 className="text-4xl font-bold mb-4">How It Works</h1>
        <p className="text-gray-500 text-lg leading-relaxed">
          Teslend is the simplest way for Bay Area Tesla owners to share accessories they already own, and for anyone with a Tesla to find gear for a weekend trip without buying something they&apos;ll only use twice a year.
        </p>
      </div>

      {/* For renters */}
      <section className="mb-8 bg-gray-50 rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-6">For Renters</h2>
        <div className="space-y-6">
          {[
            { n: '1', title: 'Browse listings', body: 'Search by Tesla model or accessory type. Filter by location. Every listing shows the owner\'s suggested daily price, condition, and photos.' },
            { n: '2', title: 'Send an inquiry', body: 'Select your rental dates and submit an inquiry. Your name, email, phone number, and note go directly to the owner with no middleman and no app messaging.' },
            { n: '3', title: 'Sort it out with the owner', body: 'The owner contacts you directly. Agree on pickup, dropoff, payment method, and any deposit you\'re both comfortable with. Teslend is not involved at this stage.' },
            { n: '4', title: 'Pick it up and ride', body: 'Get the gear, go on your trip, return it in the condition you received it.' },
          ].map(({ n, title, body }) => (
            <div key={n} className="flex gap-4">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mt-0.5"
                style={{ backgroundColor: '#E31937' }}
              >
                {n}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{title}</p>
                <p className="text-gray-500 text-sm mt-1">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* For owners */}
      <section className="mb-8 bg-gray-50 rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-6">For Owners</h2>
        <div className="space-y-6">
          {[
            { n: '1', title: 'List your accessory', body: 'Sign in with Google, create a listing in under 2 minutes. Add photos, set a daily price, enter your city and ZIP. No fee to list.' },
            { n: '2', title: 'Get inquiries by email', body: 'When someone wants to rent, you\'ll receive an email with their name, contact info, dates, and any note. Respond directly to them.' },
            { n: '3', title: 'Set your own terms', body: 'You decide the price, deposit, who you\'ll rent to, and how to get paid. Teslend doesn\'t take a cut and isn\'t involved in the transaction.' },
            { n: '4', title: 'Manage your listings', body: 'Edit, deactivate, or remove your listings any time from My Listings.' },
          ].map(({ n, title, body }) => (
            <div key={n} className="flex gap-4">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mt-0.5"
                style={{ backgroundColor: '#111111' }}
              >
                {n}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{title}</p>
                <p className="text-gray-500 text-sm mt-1">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-14">
        <h2 className="text-2xl font-bold mb-6">FAQ</h2>
        <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
          {faqs.map(({ q, a }) => (
            <details key={q} className="group">
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer select-none list-none hover:bg-gray-50 transition-colors">
                <span className="font-medium text-gray-900 text-sm pr-4">{q}</span>
                <ChevronDown size={16} className="text-gray-400 flex-shrink-0 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="px-5 pb-4 text-sm text-gray-500 leading-relaxed">{a}</div>
            </details>
          ))}
        </div>
      </section>

      {/* Disclaimer / Legal */}
      <section className="mb-14">
        <h2 className="text-2xl font-bold mb-4">Disclaimer</h2>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-sm text-gray-600 leading-relaxed space-y-3">
          <p>
            <strong>Teslend is a listing platform only.</strong> We connect Tesla accessory owners with people looking to rent them. We are not a party to any rental agreement, and we do not facilitate, guarantee, or insure any transaction conducted through the platform.
          </p>
          <p>
            All rental agreements, terms, pricing, deposits, payment arrangements, and dispute resolution are solely between the listing owner and the renter. Teslend has no involvement in and accepts no liability for any damage, loss, theft, injury, or financial loss arising from any rental arranged through this platform.
          </p>
          <p>
            Teslend does not verify the accuracy, condition, or fitness of any listed accessory, nor does it verify the identity of users beyond Google sign-in. Users are solely responsible for conducting their own due diligence before entering into any rental arrangement.
          </p>
          <p>
            By using Teslend, whether as a listing owner or as a renter, you acknowledge and agree that Teslend bears no responsibility for any outcome of transactions arranged through the platform, and that you assume all risks associated with peer-to-peer rental agreements.
          </p>
          <p className="text-xs text-gray-400 pt-2 border-t border-gray-200">
            Teslend is not affiliated with, endorsed by, or sponsored by Tesla, Inc. Tesla is a registered trademark of Tesla, Inc.
          </p>
        </div>
      </section>

      {/* CTA */}
      <div className="flex gap-4 flex-wrap">
        <Link
          href="/browse"
          className="px-6 py-3 rounded-lg text-white text-sm font-semibold text-center min-w-[180px]"
          style={{ backgroundColor: '#E31937' }}
        >
          Browse Accessories
        </Link>
        <ListButton
          variant="outline"
          className="h-auto px-6 py-3 rounded-lg border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 text-center min-w-[180px]"
          label="List an Accessory"
        />
      </div>
    </div>
  );
}
