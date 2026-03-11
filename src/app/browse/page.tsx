import { Suspense } from 'react';
import Link from 'next/link';
import FilterBar from '@/components/FilterBar';
import ListingGrid from '@/components/ListingGrid';
import { Listing, MasterAccessory } from '@/lib/types';
import { supabaseAdmin } from '@/lib/supabase';

async function getMasterAccessories(): Promise<MasterAccessory[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('master_accessories')
      .select('*')
      .eq('active', true)
      .order('name');
    if (error || !data) return [];

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

async function getListings(model?: string, category?: string, master?: string): Promise<Listing[]> {
  try {
    let query = supabaseAdmin
      .from('listings')
      .select('*, users(id, name, image)')
      .eq('active', true)
      .order('created_at', { ascending: false })
      .limit(50);

    if (model) query = query.eq('tesla_model', model);
    if (category) query = query.eq('category', category);
    if (master) {
      const { data: masterAcc } = await supabaseAdmin
        .from('master_accessories')
        .select('id')
        .eq('slug', master)
        .single();
      if (masterAcc) query = query.eq('master_accessory_id', masterAcc.id);
      else return [];
    }

    const { data } = await query;
    return data ?? [];
  } catch {
    return [];
  }
}

interface Props {
  searchParams: Promise<{ model?: string; category?: string; master?: string }>;
}

export default async function BrowsePage({ searchParams }: Props) {
  const { model, category, master } = await searchParams;

  const [listings, accessories] = await Promise.all([
    getListings(model, category, master),
    getMasterAccessories(),
  ]);

  const activeMaster = master ? accessories.find((a) => a.slug === master) : null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-4">
        <h1 className="text-3xl font-bold">Browse Accessories</h1>
      </div>

      <Suspense>
        <div className="mb-8">
          <FilterBar accessories={accessories} />
        </div>
      </Suspense>

      <ListingGrid
        listings={listings}
        emptyMessage={
          activeMaster
            ? `No listings for ${activeMaster.name} yet. Be the first to list yours!`
            : 'No listings match your filters yet. Check back soon!'
        }
      />
    </div>
  );
}
