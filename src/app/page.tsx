import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ListingGrid from '@/components/ListingGrid';
import MasterAccessoryCard from '@/components/MasterAccessoryCard';
import { Listing, MasterAccessory } from '@/lib/types';
import { supabaseAdmin } from '@/lib/supabase';

async function getRecentListings(): Promise<Listing[]> {
  try {
    const { data } = await supabaseAdmin
      .from('listings')
      .select('*, users(id, name, image), master_accessories(name)')
      .eq('active', true)
      .order('created_at', { ascending: false })
      .limit(6);
    return data ?? [];
  } catch {
    return [];
  }
}

async function getMasterAccessories(): Promise<MasterAccessory[]> {
  try {
    const { data } = await supabaseAdmin
      .from('master_accessories')
      .select('*')
      .eq('active', true)
      .order('name');
    if (!data) return [];

    const withCounts = await Promise.all(
      data.map(async (acc) => {
        const { count } = await supabaseAdmin
          .from('listings')
          .select('*', { count: 'exact', head: true })
          .eq('master_accessory_id', acc.id)
          .eq('active', true);
        return { ...acc, listing_count: count ?? 0 };
      })
    );
    return withCounts;
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [listings, accessories] = await Promise.all([
    getRecentListings(),
    getMasterAccessories(),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-black text-white py-32 px-4 overflow-hidden" style={{ minHeight: '480px' }}>
        {/* Bay Area map — decorative hero background */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero-map.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
          style={{ opacity: 0.55, objectPosition: '60% center' }}
        />
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">
            More Tesla.{' '}
            <span style={{ color: '#E31937' }}>Less clutter.</span>
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Rent what you need. List what you own.
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

      {/* Shop by Item */}
      {accessories.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Shop by Item</h2>
            <Link href="/browse" className="text-sm font-medium" style={{ color: '#E31937' }}>
              Browse all
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1">
            {accessories.map((acc) => (
              <MasterAccessoryCard key={acc.id} accessory={acc} />
            ))}
          </div>
        </section>
      )}

      {/* How it works */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-bold">How it works</h2>
            <Link href="/how-it-works" className="text-sm font-medium" style={{ color: '#E31937' }}>
              Full details
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Renters */}
            <div>
              <h3 className="font-bold text-base mb-5 pb-3 border-b border-gray-200">Renting an accessory</h3>
              <div className="space-y-4">
                {[
                  { n: '1', t: 'Browse by model or item type' },
                  { n: '2', t: 'Send an inquiry with your dates' },
                  { n: '3', t: 'Owner contacts you to arrange pickup' },
                  { n: '4', t: 'Pick it up, use it, return it' },
                ].map(({ n, t }) => (
                  <div key={n} className="flex items-center gap-3">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
                      style={{ backgroundColor: '#E31937' }}
                    >
                      {n}
                    </div>
                    <span className="text-sm text-gray-700">{t}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5">
                <Link href="/browse">
                  <Button size="sm" style={{ backgroundColor: '#E31937', color: 'white' }}>
                    Browse Accessories
                  </Button>
                </Link>
              </div>
            </div>

            {/* Owners */}
            <div>
              <h3 className="font-bold text-base mb-5 pb-3 border-b border-gray-200">Listing an accessory</h3>
              <div className="space-y-4">
                {[
                  { n: '1', t: 'Create a listing in under 2 minutes' },
                  { n: '2', t: 'Get inquiries by email — no app required' },
                  { n: '3', t: 'Set your own price, terms, and payment' },
                  { n: '4', t: 'Manage or remove your listing any time' },
                ].map(({ n, t }) => (
                  <div key={n} className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-black flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                      {n}
                    </div>
                    <span className="text-sm text-gray-700">{t}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5">
                <Link href="/listings/new">
                  <Button size="sm" variant="outline">
                    List an Accessory
                  </Button>
                </Link>
              </div>
            </div>
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
