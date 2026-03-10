import { Suspense } from 'react';
import FilterBar from '@/components/FilterBar';
import ListingGrid from '@/components/ListingGrid';
import { Listing } from '@/lib/types';

async function getListings(model?: string, category?: string): Promise<Listing[]> {
  const params = new URLSearchParams({ limit: '50' });
  if (model) params.set('model', model);
  if (category) params.set('category', category);

  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/listings?${params}`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

interface Props {
  searchParams: Promise<{ model?: string; category?: string }>;
}

export default async function BrowsePage({ searchParams }: Props) {
  const { model, category } = await searchParams;
  const listings = await getListings(model, category);

  const title = [model, category].filter(Boolean).join(' · ') || 'All Accessories';

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">{title}</h1>

      <Suspense>
        <div className="mb-8">
          <FilterBar />
        </div>
      </Suspense>

      <ListingGrid
        listings={listings}
        emptyMessage="No listings match your filters yet. Check back soon!"
      />
    </div>
  );
}
