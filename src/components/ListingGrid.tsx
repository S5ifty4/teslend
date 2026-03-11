import { Listing } from '@/lib/types';
import ListingCard from './ListingCard';

interface Props {
  listings: Listing[];
  emptyMessage?: string;
}

export default function ListingGrid({ listings, emptyMessage = 'No listings found.' }: Props) {
  if (!listings.length) {
    return (
      <div className="text-center py-16 text-gray-400">
        <div className="w-16 h-16 border-2 border-gray-200 rounded-xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {listings.map((l) => (
        <ListingCard key={l.id} listing={l} />
      ))}
    </div>
  );
}
