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
      .select('*, users(id, name, image)')
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
