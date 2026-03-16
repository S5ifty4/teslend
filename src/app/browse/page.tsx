import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import FilterBar from '@/components/FilterBar';
import ListingGrid from '@/components/ListingGrid';
import { Listing, MasterAccessory } from '@/lib/types';
import { supabaseAdmin } from '@/lib/supabase';

export const metadata: Metadata = {
  title: 'Browse Tesla Accessories for Rent',
  description: 'Browse all Tesla accessory listings in the Bay Area. Filter by model or item type. Roof racks, hitch racks, bike carriers, cargo boxes, camping gear and more.',
  alternates: {
    canonical: 'https://teslend.com/browse',
  },
};

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
    const baseSelect = '*, users(id, name, image), master_accessories(name, compatibility)';

    if (model) {
      // Two-query approach: avoids .or() with special chars in model names
      // 1. Listings where lister's tesla_model matches exactly
      let q1 = supabaseAdmin
        .from('listings')
        .select(baseSelect)
        .eq('active', true)
        .eq('tesla_model', model)
        .order('created_at', { ascending: false })
        .limit(50);

      // 2. Listings with a compatible master accessory
      const { data: compatAccs } = await supabaseAdmin
        .from('master_accessories')
        .select('id')
        .contains('compatibility', [model]);
      const compatIds = (compatAccs ?? []).map((a: { id: string }) => a.id);

      let q2Results: Listing[] = [];
      if (compatIds.length > 0) {
        let q2 = supabaseAdmin
          .from('listings')
          .select(baseSelect)
          .eq('active', true)
          .in('master_accessory_id', compatIds)
          .order('created_at', { ascending: false })
          .limit(50);
        if (category) q2 = q2.eq('category', category);
        if (master) q2 = q2.eq('master_accessory_id', compatIds[0]); // handled below
        const { data: d2 } = await q2;
        q2Results = (d2 ?? []) as Listing[];
      }

      if (category) q1 = q1.eq('category', category);
      if (master) {
        const { data: masterAcc } = await supabaseAdmin
          .from('master_accessories')
          .select('id')
          .eq('slug', master)
          .single();
        if (!masterAcc) return [];
        q1 = q1.eq('master_accessory_id', masterAcc.id);
        q2Results = q2Results.filter((l) => l.master_accessory_id === masterAcc.id);
      }

      const { data: d1 } = await q1;
      const q1Results = (d1 ?? []) as Listing[];

      // Merge + deduplicate by id, q1 first (tesla_model match = most relevant)
      const seen = new Set<string>();
      const merged: Listing[] = [];
      for (const l of [...q1Results, ...q2Results]) {
        if (!seen.has(l.id)) { seen.add(l.id); merged.push(l); }
      }
      return merged;
    }

    // No model filter — simple query
    let query = supabaseAdmin
      .from('listings')
      .select(baseSelect)
      .eq('active', true)
      .order('created_at', { ascending: false })
      .limit(50);

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
        <p className="text-gray-500 mt-1 text-sm">Tesla-specific gear for rent in the Bay Area</p>
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
