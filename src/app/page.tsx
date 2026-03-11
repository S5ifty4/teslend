import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ListingGrid from '@/components/ListingGrid';
import { ACCESSORY_CATEGORIES } from '@/lib/constants';
import { Listing } from '@/lib/types';

async function getRecentListings(): Promise<Listing[]> {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/listings?limit=6`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const listings = await getRecentListings();

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-black text-white py-24 px-4 overflow-hidden">
        {/* Bay Area map outline — decorative background */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/bay-area-outline.svg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
          style={{ opacity: 1 }}
        />
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">
            Rent Tesla accessories.{' '}
            <span style={{ color: '#E31937' }}>Bay Area first.</span>
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Tow hitches, bike racks, roof systems, cargo boxes — borrow from Tesla owners near you.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/browse">
              <Button size="lg" style={{ backgroundColor: '#E31937', color: 'white' }}>
                Browse Accessories
              </Button>
            </Link>
            <Link href="/listings/new">
              <Button size="lg" className="bg-white text-black border border-white hover:bg-gray-100 hover:text-black">
                List an Accessory
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold mb-8">Browse by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {ACCESSORY_CATEGORIES.map((cat) => (
            <Link key={cat} href={`/browse?category=${encodeURIComponent(cat)}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer text-center">
                <CardContent className="p-6">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg mx-auto mb-3" />
                  <p className="text-sm font-medium leading-tight">{cat}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-12">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'List', desc: 'Post your Tesla accessory with photos and your daily rate. Takes two minutes.' },
              { step: '2', title: 'Browse', desc: 'Filter by Tesla model and accessory type to find exactly what you need.' },
              { step: '3', title: 'Connect', desc: 'Send an inquiry with your dates. The owner gets your details and reaches out directly.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {step}
                </div>
                <h3 className="font-bold text-lg mb-2">{title}</h3>
                <p className="text-gray-500 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent listings */}
      {listings.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Recent Listings</h2>
            <Link href="/browse" className="text-sm font-medium" style={{ color: '#E31937' }}>
              View all
            </Link>
          </div>
          <ListingGrid listings={listings} />
        </section>
      )}
    </div>
  );
}
