import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ListingGrid from '@/components/ListingGrid';
import { ACCESSORY_CATEGORIES, CATEGORY_ICONS } from '@/lib/constants';
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
      <section className="bg-black text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">
            Rent Tesla accessories.{' '}
            <span style={{ color: '#E31937' }}>Bay Area first.</span>
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Tow hitches, bike racks, roof systems — borrow from Tesla owners near you.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/browse">
              <Button size="lg" style={{ backgroundColor: '#E31937', color: 'white' }}>
                Browse Accessories
              </Button>
            </Link>
            <Link href="/listings/new">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black">
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
                  <div className="text-3xl mb-2">{CATEGORY_ICONS[cat]}</div>
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
              { step: '1', title: 'List', desc: 'Post your Tesla accessory — hitch, rack, cargo box — with photos and your daily rate.', icon: '📸' },
              { step: '2', title: 'Browse', desc: 'Filter by Tesla model and accessory type to find exactly what you need.', icon: '🔍' },
              { step: '3', title: 'Connect', desc: 'Send a message through our secure relay. Neither side sees the other\'s real email.', icon: '✉️' },
            ].map(({ step, title, desc, icon }) => (
              <div key={step} className="text-center">
                <div className="text-4xl mb-4">{icon}</div>
                <h3 className="font-bold text-lg mb-2">{step}. {title}</h3>
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
              View all →
            </Link>
          </div>
          <ListingGrid listings={listings} />
        </section>
      )}
    </div>
  );
}
